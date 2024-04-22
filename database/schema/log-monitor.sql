CREATE SCHEMA report;

USE report;

CREATE USER 'report_agent'@'%' IDENTIFIED BY 'rA93{1L8=9D!';
GRANT ALL PRIVILEGES ON report.* TO 'report_agent'@'%';
FLUSH PRIVILEGES;

CREATE TABLE report.robot_run_log (
    instance_id VARCHAR(50),
    process_id_version VARCHAR(50),
    user_id VARCHAR(10),
    instance_state VARCHAR(20),
    launch_time TIMESTAMP,
    created_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report.robot_run_overall (
    instance_id VARCHAR(50),
    process_id VARCHAR(50),
    version INT,
    failed INT,
    passed INT,
    error_message NVARCHAR(1000),
    created_date TIMESTAMP DEFAULT NOW()
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS robot_run_overall;
CREATE TABLE report.robot_run_overall (
    uuid VARCHAR(256),
    user_id INT,
    process_id VARCHAR(50),
    version INT,
    failed INT,
    passed INT,
    error_message NVARCHAR(1000),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    elapsed_time INT,
    created_date TIMESTAMP DEFAULT NOW()
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX uuid_idx ON report.robot_run_overall (uuid);

CREATE TABLE report.robot_run_detail (
    user_id INT,
    process_id VARCHAR(50),
    version INT,
    uuid VARCHAR(256),
    kw_id INT,
    kw_name VARCHAR(100),
    kw_args VARCHAR(1000),
    kw_status VARCHAR(100),
    messages VARCHAR(1000),
    start_time DATETIME,
    end_time DATETIME
);

CREATE INDEX uuid_idx ON report.robot_run_detail (uuid);
CREATE INDEX kw_id_idx ON report.robot_run_detail (kw_id);

