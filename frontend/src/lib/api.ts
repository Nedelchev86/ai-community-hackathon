export const API_BASE = "https://ai-community-hackathon-be.onrender.com";

export async function getEvents() {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json();
}

export async function createEvent(data: any, token: string) {
    const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create event");
    return res.json();
}

export async function updateEvent(eventId: number, data: any, token: string) {
    const res = await fetch(`${API_BASE}/events/${eventId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update event");
    return res.json();
}

export async function deleteEvent(eventId: number, token: string) {
    const res = await fetch(`${API_BASE}/events/${eventId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to delete event");
    return res.json();
}

export async function joinEvent(eventId: number, token: string) {
    const res = await fetch(`${API_BASE}/events/${eventId}/join`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to join event");
    return res.json();
}
