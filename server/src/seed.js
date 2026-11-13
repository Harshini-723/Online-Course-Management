
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Course from "./models/Course.js";

dotenv.config();

const sampleCourses = [
  {
    title: "Complete Web Development",
    subtitle: "Learn HTML, CSS, JavaScript and React",
    description: "Build modern responsive websites from scratch. Learn frontend development with practical examples.",
    category: "Development",
    level: "Beginner",
    price: 0,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    lessons: [
      { title: "Introduction to Web Development", duration: "15 min" },
      { title: "HTML Fundamentals", duration: "25 min" },
      { title: "CSS and Responsive Design", duration: "30 min" },
      { title: "JavaScript Basics", duration: "35 min" },
      { title: "Introduction to React", duration: "40 min" }
    ]
  },
  {
    title: "Python Programming",
    subtitle: "Master Python from zero to advanced",
    description: "Learn Python programming, variables, loops, functions and object-oriented programming.",
    category: "Development",
    level: "Beginner",
    price: 499,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
    lessons: [
      { title: "Introduction to Python" },
      { title: "Variables and Data Types" },
      { title: "Loops and Conditions" },
      { title: "Functions" },
      { title: "Object Oriented Programming" }
    ]
  },
  {
    title: "Java Programming Masterclass",
    subtitle: "Learn Java and object-oriented programming",
    description: "Understand Java fundamentals, classes, objects, inheritance and exception handling.",
    category: "Development",
    level: "Intermediate",
    price: 599,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    lessons: [
      { title: "Java Introduction" },
      { title: "Classes and Objects" },
      { title: "Inheritance" },
      { title: "Polymorphism" },
      { title: "Exception Handling" }
    ]
  },
  {
    title: "Data Structures and Algorithms",
    subtitle: "Build strong problem-solving skills",
    description: "Study arrays, linked lists, stacks, queues, trees and sorting algorithms.",
    category: "Development",
    level: "Intermediate",
    price: 399,
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    lessons: [
      { title: "Introduction to Data Structures" },
      { title: "Arrays and Linked Lists" },
      { title: "Stacks and Queues" },
      { title: "Trees and Graphs" },
      { title: "Sorting and Searching" }
    ]
  },
  {
    title: "Database Management System",
    subtitle: "Learn SQL and database design",
    description: "Understand relational databases, SQL queries, normalization and database management.",
    category: "Data Science",
    level: "Beginner",
    price: 299,
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
    lessons: [
      { title: "Database Fundamentals" },
      { title: "ER Diagrams" },
      { title: "SQL Commands" },
      { title: "Joins and Subqueries" },
      { title: "Normalization" }
    ]
  },
  {
    title: "Machine Learning Fundamentals",
    subtitle: "Discover the power of artificial intelligence",
    description: "Learn machine learning concepts, supervised learning, unsupervised learning and model evaluation.",
    category: "Data Science",
    level: "Intermediate",
    price: 799,
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    lessons: [
      { title: "Introduction to Machine Learning" },
      { title: "Supervised Learning" },
      { title: "Unsupervised Learning" },
      { title: "Model Training" },
      { title: "Model Evaluation" }
    ]
  },
  {
    title: "UI/UX Design Essentials",
    subtitle: "Create beautiful user experiences",
    description: "Learn user research, wireframing, prototyping and professional interface design.",
    category: "Design",
    level: "Beginner",
    price: 349,
    thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c",
    lessons: [
      { title: "Introduction to UI/UX" },
      { title: "User Research" },
      { title: "Wireframing" },
      { title: "Prototyping" },
      { title: "Usability Testing" }
    ]
  },
  {
    title: "Full Stack Development",
    subtitle: "Become a full stack developer",
    description: "Build complete applications using React, Node.js, Express and MongoDB.",
    category: "Development",
    level: "Advanced",
    price: 999,
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    lessons: [
      { title: "Frontend Development" },
      { title: "React Applications" },
      { title: "Node.js and Express" },
      { title: "MongoDB Integration" },
      { title: "Full Stack Project" }
    ]
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    let instructor = await User.findOne({
      email: "demo.instructor@learnhub.com"
    });

    if (!instructor) {
      instructor = await User.create({
        name: "LearnHub Instructor",
        email: "demo.instructor@learnhub.com",
        password: await bcrypt.hash("LearnHub@123", 12),
        role: "instructor"
      });
    }

    let added = 0;

    for (const courseData of sampleCourses) {
      const existing = await Course.findOne({
        title: courseData.title,
        instructor: instructor._id
      });

      if (!existing) {
        await Course.create({
          ...courseData,
          instructor: instructor._id,
          published: true
        });
        added++;
        console.log("Added:", courseData.title);
      }
    }

    console.log(`Finished! ${added} new courses added.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedCourses();
