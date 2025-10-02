function mapAthleteForExcel(athlete) {
  return {
    // _id: athlete._id ? athlete._id.toString() : "",
    // event_id: athlete.event_id ? athlete.event_id.toString() : "",
    Bib: athlete.bib || "",
    Name: athlete.name || "",
    BibName: athlete.bib_name || "",
    Gender: athlete.gender === true ? "Male" : athlete.gender === false ? "Female" : "",
    Email: athlete.email || "",
    Phone: athlete.phone || "",
    DOB: athlete.dob ? athlete.dob.toISOString().split("T")[0] : "",
    CCCD: athlete.cccd || "",
    Nationality: athlete.nationality || "",
    Nation: athlete.nation || "",
    City: athlete.city || "",
    Address: athlete.address || "",
    Team: athlete.team || "",
    TeamChallenge: athlete.team_challenge || "",
    IDTicket: athlete.id_ticket || "",
    Order: athlete.order || "",
    Chip: athlete.chip || "",
    EPC: athlete.epc || "",
    Distance: athlete.distance || "",
    PatronName: athlete.patron_name || "",
    PatronPhone: athlete.patron_phone || "",
    Medical: athlete.medical || "",
    Blood: athlete.blood || "",
    Size: athlete.size || "",
    Payment: athlete.payment === true ? "Yes" : athlete.payment === false ? "No" : "",
    Checkin: athlete.checkin === true ? "Yes" : athlete.checkin === false ? "No" : "",
    Registry: athlete.registry || "",
    Age: athlete.age != null ? athlete.age : "",
    AgeGroup: athlete.age_group || "",
    CreatedAt: athlete.createdAt ? athlete.createdAt.toISOString().split("T")[0] : "",
    UpdatedAt: athlete.updatedAt ? athlete.updatedAt.toISOString().split("T")[0] : ""
  };
}

module.exports = mapAthleteForExcel;