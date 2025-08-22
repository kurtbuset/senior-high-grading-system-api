const config = require('../config.json')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { Op } = require('sequelize')
const sendEmail = require('../_helpers/send-email')
const db = require('../_helpers/db')


module.exports = {
  getHomerooms,
  getOneHomeroom,
  getConsolidatedSheet
}

// services/homeroom.service.js or controller
async function getConsolidatedSheet(homeroomId, { semester }) {
  try {
    // 1. Find homeroom with grade_level + strand info
    const homeroom = await db.HomeRoom.findOne({
      where: { id: homeroomId },
      include: [
        { model: db.Grade_Level, as: "grade_level", attributes: ["id", "level"] },
        { model: db.Strand, as: "strand", attributes: ["id", "code", "name"] },
      ],
    });

    if (!homeroom) throw "Homeroom not found"

    // 2. Fetch subjects from curriculum_subject based on homeroom’s grade_level, strand, and semester
    const subjects = await db.Curriculum_Subject.findAll({
      where: {
        grade_level_id: homeroom.grade_level_id,
        strand_id: homeroom.strand_id,
        semester: semester,
      },
      include: [{ model: db.Subject, as: "subject", attributes: ["id", "name"] }],
    });

    // 3. Fetch students who belong in this homeroom
    const students = await db.Student.findAll({
      where: { homeroom_id: homeroom.id },
      include: [
        {
          model: db.Account,
          attributes: ["id", "firstname", "lastname"],
        },
      ],
      order: [[{ model: db.Account }, "lastname", "ASC"]],
    });

    return {
      homeroom,
      subjects,
      students,
    };
  } catch (error) {
    console.error("Error fetching consolidated sheet:", error);
    throw error;
  }
}


async function getOneHomeroom(homeroomId) {
  const homeroom = await db.HomeRoom.findOne({
    where: { id: homeroomId},
    include: [
      {
        model: db.Grade_Level,
        as: "grade_level",
        attributes: ["level"],   // only fetch "level"
      },
      {
        model: db.Strand,
        as: "strand",
        attributes: ["name"],    // only fetch "name"
      },
    ],
    attributes: ["id", "section"], // only fetch "id" and "section" from homeroom
  })

  if(!homeroom) throw `No homeroom found with id ${id}`

   return {
    id: homeroom.id,
    grade_level: homeroom.grade_level.level,
    section: homeroom.section,
    strand: homeroom.strand.name,
  };
  
}

async function getHomerooms() {
  const homerooms = await db.HomeRoom.findAll({
    attributes: ["id", "section"],
    include: [
      {
        model: db.Grade_Level,
        as: "grade_level",
        attributes: ["level"],
      },
      {
        model: db.Strand,
        as: "strand",
        attributes: ["name"],
      },
    ],
    raw: true,
    nest: true, // so grade_level and strand appear as nested objects
  });

  // Reformat the result
  return homerooms.map(h => ({
    id: h.id,
    grade_level: h.grade_level.level,
    section: h.section,
    strand: h.strand.name,
  }));
}