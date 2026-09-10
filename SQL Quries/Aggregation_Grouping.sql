-- The 5 Core Aggregation Functions

-- Note: Except for COUNT(*), all aggregation functions completely ignore NULL values when performing calculations.

SELECT 
    COUNT(*) AS total_employees,
    SUM(salary) AS total_payroll,
    AVG(salary) AS average_salary,
    MAX(salary) AS highest_salary,
    MIN(salary) AS lowest_salary
FROM staff;


select count(salary) from staff where salary>40000;


-- Grouping Data (GROUP BY) -> splits data into buckets 

INSERT INTO staff (emp_id, address, phone_number)
VALUES 
  (101, 'Delhi, India', '+91 98765 43210'),
  (102, 'Mumbai, India', '+91 98765 43211'),
  (103, 'Delhi, India', '+91 98765 43212'),
  (104, 'Bangalore, India', '+91 98765 43213'),
  (105, 'Mumbai, India', '+91 98765 43214') 
ON CONFLICT (emp_id) 
DO UPDATE SET 
    address = EXCLUDED.address,
    phone_number = EXCLUDED.phone_number
RETURNING *;

-- Employee Distribution & Payroll Analysis by City
SELECT 
    address AS city,
    COUNT(*) AS employee_count,
    SUM(salary) AS total_payroll,
    AVG(salary) AS average_salary
FROM public.staff
GROUP BY address
ORDER BY total_payroll DESC;

-- Find Cities with High Average Overhead (HAVING)
select 
  address as city, 
  count(staff_name) as employee_count,
  avg(salary) as average_salary
  from public.staff
group by address having avg(salary)>40000;

-- where and having

select address, count(staff_name) as staff_count from staff group by address having address='Mumbai, India';