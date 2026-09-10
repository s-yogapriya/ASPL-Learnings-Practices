-- SQL Practice Online

-- Basic SELECT - All Columns
SELECT * FROM employees;

-- SELECT Specific Columns
SELECT first_name, last_name, SALARY FROM employees;

-- SELECT DISTINCT
SELECT DISTINCT department_id FROM employees; 

-- SELECT with Column Aliases
SELECT first_name,last_name FROM employees;

-- SELECT with Expressions
SELECT first_name,last_name,salary,salary*0.10 AS bonus FROM employees;

-- Reorder the Projected Columns
SELECT salary, last_name, first_name FROM employees;

-- DISTINCT on Multiple Columns
SELECT DISTINCT department_id,job_id FROM employees;      

-- Use a Table Alias
SELECT first_name, SALARY FROM employees AS e;

-- Add a Constant Literal Column
SELECT first_name,'Employee' AS record_type FROM employees;

-- Calculate Monthly Salary
SELECT 
    first_name,
    salary,
    ROUND(salary/12.0,2) AS monthly_salary
FROM employees;

-- SELECT Without FROM
SELECT 1+1 AS result;

-- Capstone — Compose a Projection
SELECT 
employee_id AS staff_id, 
first_name, last_name, 
'Employee' AS record_type,
salary*0.10 AS projected_bonus,
salary+(salary*0.10) as projected_total_compensation  
FROM employees;

