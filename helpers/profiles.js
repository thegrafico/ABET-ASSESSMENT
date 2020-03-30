/**
 * All privileges are here.
 * If you Edit a privilege, remember to edit the app.js, the routes middleware 
*/

// Profiles
const admin = "admin";
const coordinator = "coordinator";
const professor = "professor";

// all profiles
module.exports.allProfiles = [admin, professor, coordinator];


// Admin Routes
const adminOptions = [
    { url: "admin/department", name: "Departments" },
    { url: "admin/users", name: "Users" },
    { url: "admin/studyprograms", name: "Study Programs" },
    { url: "admin/courses", name: "Courses" },
    { url: "admin/outcomes", name: "Outcomes" },
    { url: "admin/evaluation", name: "Evaluation Rubric" },
    { url: "admin/term", name: "School Term" },
    { url: "admin/courseMapping", name: "Course Mapping" },
];

// COORDINATOR ROUTES
const coordinatorOptions = [
    adminOptions[4], // outcomes
    adminOptions[6], // term
    adminOptions[7], // course mapping
];

// PROFILES WITH ADMIN PRIVILEGES
module.exports.profilesWithPrivilege = [admin, coordinator];

// export profiles
module.exports.admin = admin;
module.exports.coordinator = coordinator;
module.exports.professor = professor;

// export routes
module.exports.routes = {
    admin: adminOptions,
    coordinator: coordinatorOptions,
};

module.exports.statusOfAssessment = {
    completed: "completed", 
    in_progress: "in_progress",
    archive: "archive"
};

/* Coordinator Table status*/
module.exports.assessmentStatus = {
    "in_progress": { name: "In Progress" },
    "completed": { name: "Completed" },
    "archive": { name: "Archive" }
};

