# Add robot_key to robot table
ALTER TABLE robot
    add column robot_key VARCHAR(64) UNIQUE;

CREATE INDEX idx_robot_key ON robot(robot_key);

CREATE TRIGGER before_robot_insert
BEFORE INSERT ON robot
FOR EACH ROW
BEGIN
    -- Generate robot_key using SHA256 hash
    SET NEW.robot_key = SHA2(CONCAT(NEW.userId, NEW.processId, NEW.processVersion), 256);
END;

DELIMITER //
CREATE PROCEDURE update_old_robots()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE userId_val INT;
    DECLARE processId_val VARCHAR(255);
    DECLARE processVersion_val INT;
    DECLARE robot_key_val VARCHAR(64);

    -- Declare cursor for selecting all old robots
    DECLARE cur CURSOR FOR
        SELECT userId, processId, processVersion
        FROM robot;

    -- Declare handler for cursor not found condition
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    -- Start iterating over old robots
    read_loop: LOOP
        FETCH cur INTO userId_val, processId_val, processVersion_val;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Generate new robot_key using SHA256 hash
        SET robot_key_val = SHA2(CONCAT(userId_val, processId_val, processVersion_val), 256);

        -- Update robot_key for the current row
        UPDATE robot
        SET robot_key = robot_key_val
        WHERE userId = userId_val
        AND processId = processId_val
        AND processVersion = processVersion_val;
    END LOOP;

    CLOSE cur;
END//
DELIMITER ;

CALL update_old_robots();

# Add connection_key to connection table
ALTER TABLE connection
    ADD COLUMN connection_key VARCHAR(64);

CREATE INDEX idx_connection_key ON connection(connection_key);


DELIMITER //
DROP TRIGGER IF EXISTS before_connection_insert;
CREATE TRIGGER before_connection_insert
BEFORE INSERT ON connection
FOR EACH ROW
BEGIN
    SET NEW.connection_key = SHA2(CONCAT(NEW.userId, NEW.provider), 256);
END//
DELIMITER ;

DELIMITER //
DROP PROCEDURE IF EXISTS update_old_connections;
CREATE PROCEDURE update_old_connections()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE provider_val VARCHAR(255);
    DECLARE name_val VARCHAR(255);
    DECLARE userId_val INT;
    DECLARE connection_key_val VARCHAR(64);

    -- Declare cursor for selecting all old connections
    DECLARE cur CURSOR FOR
        SELECT provider, name, userId
        FROM connection;

    -- Declare handler for cursor not found condition
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    -- Start iterating over old connections
    read_loop: LOOP
        FETCH cur INTO provider_val, name_val, userId_val;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Generate new connection_key using SHA256 hash
        SET connection_key_val = SHA2(CONCAT(userId_val, provider_val), 256);

        -- Update connection_key for the current row
        UPDATE connection
        SET connection_key = connection_key_val
        WHERE provider = provider_val
        AND userId = userId_val;
    END LOOP;

    CLOSE cur;
END//

DELIMITER ;

CALL update_old_connections();

# Create table to mapping robot and connection
CREATE TABLE robot_connection
(
    robot_key      VARCHAR(64) NOT NULL,
    connection_key VARCHAR(64) NOT NULL,
    PRIMARY KEY (robot_key, connection_key),
    FOREIGN KEY (robot_key) REFERENCES robot (robot_key),
    FOREIGN KEY (connection_key) REFERENCES connection (connection_key)
);



