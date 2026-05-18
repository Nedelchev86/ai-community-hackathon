export const API_BASE = "https://ai-community-hackathon-be.onrender.com";

export async function getReviewsStats() {
    const res = await fetch(`${API_BASE}/reviews/stats`);
    if (!res.ok) throw new Error("Failed to fetch reviews stats");
    return res.json();
}

export async function getRecentReviews(limit = 10) {
    const res = await fetch(`${API_BASE}/reviews/recent?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch recent reviews");
    return res.json();
}

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

export async function addEventComment(eventId: number, content: string, token: string) {
    const res = await fetch(`${API_BASE}/events/${eventId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
}

export async function toggleEventSupport(eventId: number, token: string) {
    const res = await fetch(`${API_BASE}/events/${eventId}/support`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to toggle support");
    return res.json();
}

export async function getStories() {
    const res = await fetch(`${API_BASE}/stories`);
    if (!res.ok) throw new Error("Failed to fetch stories");
    return res.json();
}

export async function createStory(data: any, token: string) {
    const res = await fetch(`${API_BASE}/stories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create story");
    return res.json();
}

export async function addStoryComment(storyId: number, content: string, token: string) {
    const res = await fetch(`${API_BASE}/stories/${storyId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to add comment");
    return res.json();
}

export async function toggleStorySupport(storyId: number, token: string) {
    const res = await fetch(`${API_BASE}/stories/${storyId}/support`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to toggle support");
    return res.json();
}


