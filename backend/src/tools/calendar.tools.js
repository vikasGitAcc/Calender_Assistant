export const createEventTool = async({title,date,location,timing, description}) => {
    return "Event added successfully"
}

export const getEventTool = async({date})=>{
    return JSON.stringify({
        title: "Meeting with sujoy",
        date: "14th-sep-2026",
        location: "GMEET",
        timing: "2:00 A.M."
    })
}