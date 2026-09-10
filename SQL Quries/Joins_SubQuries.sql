INSERT INTO public.departments (dept_id, dept_name)
VALUES 
  (10, 'Engineering'),
  (20, 'Marketing'),
  (30, 'Human Resources'),
  (40, 'Design')
RETURNING *;

INSERT INTO public.projects (project_id, project_name, dept_id)
VALUES 
  (501, 'Cloud Migration', 10),  -- Engineering
  (502, 'E-commerce App', 10),   -- Engineering
  (503, 'Social Media Campaign', 20), -- Marketing
  (504, 'Brand Identity Redesign', 40), -- Design
  (505, 'Internal Security Audit', NULL) -- Unassigned Department
RETURNING *;

-- SQL Joins

-- 1. INNER JOIN
-- Returns rows only when there is a match in both tables.
SELECT p.project_name, d.dept_name
FROM public.projects p
INNER JOIN public.departments d ON p.dept_id = d.dept_id;

-- 2. LEFT JOIN 
-- Returns all records from the left table (projects), plus matching records from the right table. If there is no match, it prints NULL
SELECT p.project_name, d.dept_name
FROM public.projects p
LEFT JOIN public.departments d ON p.dept_id = d.dept_id;


-- 3. RIGHT JOIN
-- Returns all records from the right table (departments), even if they don't have any projects assigned.

SELECT p.project_name, d.dept_name
FROM public.projects p
RIGHT JOIN public.departments d ON p.dept_id = d.dept_id;

-- 4. FULL OUTER JOIN
-- Returns all records
SELECT p.project_name, d.dept_name
FROM public.projects p
full outer join public.departments d ON p.dept_id = d.dept_id;

-- Subqueries
-- A Subquery is simply a query nested inside another query. The database executes the inner query first, then hands the result to the outer query.

SELECT project_name 
FROM public.projects
WHERE dept_id = (
    SELECT dept_id 
    FROM public.departments 
    WHERE dept_name = 'Engineering'
);
