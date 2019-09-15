CREATE TABLE DEPARTMENT (
  dep_ID int PRIMARY KEY auto_increment,
  dep_name varchar(255) NOT NULL,
  dep_description varchar(255),
  date_created datetime default CURRENT_TIMESTAMP -- add the default date
);

-- DONE
CREATE TABLE COURSE(
  course_ID int PRIMARY KEY auto_increment,
  course_name varchar(25) NOT NULL,
  course_number varchar(255) NOT NULL, -- Need to confirm data type
  course_description varchar(255),
  date_created datetime default CURRENT_TIMESTAMP
);

-- DONE
CREATE TABLE ACADEMIC_TERM(
  term_ID int PRIMARY KEY auto_increment,
  term_name varchar(255) NOT NULL
);

-- dont know Inter_ID (DONE)
CREATE TABLE USER (
  user_ID int PRIMARY KEY auto_increment,
  inter_ID varchar(255),
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255),
  phone_number varchar(255) NOT NULL,
  date_created datetime default CURRENT_TIMESTAMP
);

-- DONE
CREATE TABLE STUDY_PROGRAM(
  prog_ID int PRIMARY KEY auto_increment,
  prog_name varchar(255) NOT NULL,
  date_created datetime default CURRENT_TIMESTAMP,
  dep_ID int, -- foreign
  FOREIGN KEY (dep_ID) REFERENCES DEPARTMENT(dep_ID)
);

-- DONE
CREATE TABLE STUDENT_OUTCOME(
  outc_ID int PRIMARY KEY auto_increment,
  outc_name varchar(255) NOT NULL,
  outc_description varchar(255),
  date_created datetime default CURRENT_TIMESTAMP,
  prog_ID int, -- foreign
  FOREIGN KEY (prog_ID) REFERENCES STUDY_PROGRAM(prog_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE EVALUATION_RUBRIC(
  rubric_ID int PRIMARY KEY auto_increment,
  rubric_name varchar(255) NOT NULL,
  rubric_description varchar(255),
  outc_ID int, -- foreign key
  FOREIGN KEY (outc_ID) REFERENCES STUDENT_OUTCOME(outc_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE PERF_CRITERIA (
  perC_ID int PRIMARY KEY auto_increment, 
  perC_Desk varchar(255), -- Need to confirm data type
  perC_order int,         -- Need to confirm data type
  outc_ID int, -- foreign
  FOREIGN KEY (outc_ID) REFERENCES STUDENT_OUTCOME(outc_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE PERFORMANCE_RUBRIC(
  rubric_ID int PRIMARY KEY auto_increment,
  perC_ID int, -- foreign
  FOREIGN KEY (perC_ID) REFERENCES PERF_CRITERIA(perC_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE ASSESSMENT(
  assessment_ID int PRIMARY KEY auto_increment,
  course_ID int, -- foreing
  term_ID int NOT NULL, -- Dont know so well
  user_ID int, -- Foreign
  rubric_ID int, -- Foreign
  FOREIGN KEY (user_ID) REFERENCES USER(user_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (course_ID) REFERENCES COURSE(course_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (rubric_ID) REFERENCES PERFORMANCE_RUBRIC(rubric_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE REPORTS(
  report_ID int PRIMARY KEY auto_increment,
  grade_A int,
  grade_B int,
  grade_C int,
  grade_D int,
  grade_F int,
  UW varchar(255), -- Need to confirm data type
  evaluation_comments varchar(255),
  reflexion_comments varchar(255),
  actions_comments varchar(255),
  assessment_ID int, -- foreign
  FOREIGN KEY (assessment_ID) REFERENCES ASSESSMENT(assessment_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE STUDENT_PERFORMANCE(
  student_ID int PRIMARY KEY auto_increment,
  pc_1 varchar(255),  -- Need to confirm data type
  pc_2 varchar(255),  -- Need to confirm data type
  pc_3 varchar(255),  -- Need to confirm data type
  pc_4 varchar(255),  -- Need to confirm data type
  pc_5 varchar(255),  -- Need to confirm data type
  assessment_ID int, -- foreign
  FOREIGN KEY (assessment_ID) REFERENCES ASSESSMENT(assessment_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE USER_DEP (
  user_ID int, -- Foreign
  dep_ID int, -- Foreign
  FOREIGN KEY (user_ID) REFERENCES USER(user_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (dep_ID) REFERENCES DEPARTMENT(dep_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE PROG_COURSE(
  course_ID int,
  prog_ID int,
  FOREIGN KEY (course_ID) REFERENCES COURSE(course_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (prog_ID) REFERENCES STUDY_PROGRAM(prog_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- DONE
CREATE TABLE OUTCOME_COURSE(
  course_ID int,
  outc_ID int,
  FOREIGN KEY (outc_ID) REFERENCES STUDENT_OUTCOME(outc_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (course_ID) REFERENCES COURSE(course_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE PROFILE(
  profile_ID int PRIMARY KEY auto_increment,
  profile_Name varchar(255)
);

CREATE TABLE USER_PROFILES(
  user_ID int,			-- changed from var(255) to int, reason: because the variables have to be the same format if you want them to be a foreing key
  profile_ID int,		-- changed from var(255) to int, reason: because the variables have to be the same format if you want them to be a foreing key
  FOREIGN KEY (user_ID) REFERENCES USER(user_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (profile_ID) REFERENCES PROFILE(profile_ID) ON DELETE CASCADE ON UPDATE CASCADE
);
