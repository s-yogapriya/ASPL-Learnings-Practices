--syntax
/*CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;*/

CREATE TABLE CUSTOMERS (
   ID INT NOT NULL,
   NAME VARCHAR (20) NOT NULL,
   AGE INT NOT NULL,
   ADDRESS CHAR (25),
   SALARY DECIMAL (18, 2),
   PRIMARY KEY (ID)
);

INSERT INTO CUSTOMERS VALUES 
(1, 'Ramesh', 32, 'Ahmedabad', 2000.00 ),
(2, 'Khilan', 25, 'Delhi', 1500.00 ),
(3, 'Kaushik', 23, 'Kota', 2000.00 ),
(4, 'Chaitali', 25, 'Mumbai', 6500.00 ),
(5, 'Hardik', 27, 'Bhopal', 8500.00 ),
(6, 'Komal', 22, 'Hyderabad', 4500.00 ),
(7, 'Muffy', 24, 'Indore', 10000.00 );

select * from CUSTOMERS;

-- 1. Create the ORDERS table with a Foreign Key link to CUSTOMERS
CREATE TABLE ORDERS (
   ORDER_ID INT NOT NULL,
   CUSTOMER_ID INT NOT NULL,
   AMOUNT DECIMAL (18, 2) NOT NULL,
   ORDER_DATE DATE NOT NULL,
   PRIMARY KEY (ORDER_ID),
   FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMERS(ID)
);

-- 2. Insert the provided data into the ORDERS table
INSERT INTO ORDERS (ORDER_ID, CUSTOMER_ID, AMOUNT, ORDER_DATE) VALUES 
(101, 1, 250.00, '2025-07-01'),
(102, 2, 300.00, '2025-07-03'),
(103, 1, 150.00, '2025-07-05'); Go


-- Create HIGH_EARNERS view
CREATE VIEW HIGH_EARNERS AS
SELECT ID, NAME, SALARY
FROM CUSTOMERS
WHERE SALARY > 2000;
GO

-- Display HIGH_EARNERS
SELECT * FROM HIGH_EARNERS;
GO


CREATE VIEW CUSTOMER_ORDERS_VIEW AS
SELECT C.ID, C.NAME, O.ORDER_ID
FROM CUSTOMERS C
JOIN ORDERS O ON C.ID = O.CUSTOMER_ID;
GO

select * from CUSTOMER_ORDERS_VIEW;

--Drop

DROP VIEW IF EXISTS CUSTOMER_ORDERS_VIEW;
DROP VIEW IF EXISTS HIGH_EARNERS;
GO

DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS CUSTOMERS;
GO

--Update 

UPDATE HIGH_EARNERS 
SET salary = 30000 WHERE name = 'Muffy'; Go

BEGIN TRANSACTION;

BEGIN TRY
    -- Step 1: Insert a new order for Chaitali (ID = 4)
    INSERT INTO ORDERS (ORDER_ID, CUSTOMER_ID, AMOUNT, ORDER_DATE) 
    VALUES (104, 4, 1250.00, '2026-09-10');

    -- Step 2: Update Chaitali's salary record
    UPDATE CUSTOMERS 
    SET SALARY = 7500.00 
    WHERE ID = 4;

    -- If both steps succeed, save changes permanently
    COMMIT TRANSACTION;
    PRINT 'Transaction successful!';
END TRY
BEGIN CATCH
    -- If any step fails, undo everything
    ROLLBACK TRANSACTION;
    PRINT 'Transaction failed. All changes rolled back.';
END CATCH;




