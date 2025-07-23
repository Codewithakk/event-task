export interface Event {
    id: number;
    name: string;
    description: string;
    images: string[];
    startDate: string;
    endDate: string;
    totalGuests?: number;
    category?: string;
    organizer: {
        id: number;
        name: string;
        email: string;
    };
}

export interface EventFormValues {
    name: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    totalGuests?: number;
    category?: string;
    images?: File[];
}

export interface EventsResponse {
    events: Event[];
    total: number;
}