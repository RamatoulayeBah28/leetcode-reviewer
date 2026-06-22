-- Cached scheduling state on problems, so "what's due today" doesn't need
-- to recompute from full review history every time.
ALTER TABLE problems ADD COLUMN current_interval_days INT NOT NULL DEFAULT 1;
ALTER TABLE problems ADD COLUMN last_practiced TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE problems ADD COLUMN next_review_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- One row per review event (1:N from problems -> reviews, plain FK column,
-- NOT a join table -- contrast with problem_topics/problem_patterns).
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    problem_id INT REFERENCES problems (id) ON DELETE CASCADE,
    confidence INT NOT NULL CONSTRAINT chk_confidence CHECK (confidence IN (1,2,3,4,5)),
    solved_status TEXT,  -- e.g. 'solved_alone' / 'solved_with_hints' / 'not_solved' / 'not_attempted'
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spaced-repetition scheduling algorithm 
-- applied in POST /problems/{id}/review against current_interval_days:
--   confidence 1 (forgot)   -> reset to 1 day, ignore current interval
--   confidence 2 (weak)     -> reset to 3 days
--   confidence 3 (okay)     -> reset to 7 days
--   confidence 4 (good)     -> max(10, current_interval_days * 1.3)
--   confidence 5 (mastered) -> max(15, current_interval_days * 2)
-- 1-3 reset regardless of growth history (a bad review means the existing
-- interval was wrong); 4-5 grow the existing interval but never below the
-- floor even if current_interval_days was still small. Multiplier cases
-- produce a float -- round/cast to int before writing back to the column.
