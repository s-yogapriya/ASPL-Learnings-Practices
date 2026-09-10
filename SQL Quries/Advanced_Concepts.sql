-- 1. Views (The Virtual Windows)
-- A View is a saved SELECT query that acts like a virtual table. It does not store separate physical data; instead, it dynamically fetches data from the underlying tables whenever you query it.

-- Create a view that combines projects and departments seamlessly
CREATE VIEW v_project_details AS
SELECT p.project_id, p.project_name, d.dept_name
FROM public.projects p
INNER JOIN public.departments d ON p.dept_id = d.dept_id;

-- How to use it (Treat it like a normal table)
SELECT * FROM v_project_details WHERE dept_name = 'Engineering';


-- 2. Indexes (The Fast-Pass Lookup)
-- An Index is a hidden data structure (usually a B-Tree under the hood) that helps the database find rows instantly without scanning the entire table from top to bottom

-- Create an index to speed up searches on project names
CREATE INDEX idx_projects_name ON public.projects(project_name);

-- The optimizer will automatically use this index when running:
SELECT * FROM public.projects WHERE project_name = 'Cloud Migration';

-- 3. Triggers (The Automated Listeners)
-- A Trigger is a script that automatically fires an action whenever a specific event occurs on a table (like BEFORE or AFTER an INSERT, UPDATE, or DELETE).

-- 1. Create a function that logs or checks data
CREATE OR REPLACE FUNCTION check_project_name()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.project_name IS NULL THEN
        RAISE EXCEPTION 'A project must have a valid name!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the trigger to the projects table
CREATE TRIGGER trg_before_project_insert
BEFORE INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION check_project_name();


4. Stored Procedures (The Pre-Compiled Code Blocks)
A Stored Procedure is a collection of SQL statements saved inside the database that you can call by name over and over again. It can accept input parameters and execute complex logical tasks.

-- Create a procedure to quickly add a new project
CREATE OR REPLACE PROCEDURE add_new_project(
    p_id INT, 
    p_name VARCHAR, 
    d_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.projects (project_id, project_name, dept_id)
    VALUES (p_id, p_name, d_id);
    
    COMMIT; -- Saves the transaction permanently
END;
$$;

-- How to execute/run a Stored Procedure in Postgres
CALL add_new_project(506, 'Mobile UI Redesign', 40);
