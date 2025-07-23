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

export interface Event {
    id: number;
    name: string;
    description: string;
    images: string[];
    startDate: string;
    endDate: string;
    totalGuests: number | null;
    category: string;
    organizer: {
        id: number;
        email: string;
        name: string;
    };
    organizerId: number;
}

export interface EventsResponse {
    events: Event[];
    total: number;
}

export interface EventFilters {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name' | 'startDate' | 'endDate';
    sortOrder?: 'asc' | 'desc';
    category?: string;
    startDate?: string;
    endDate?: string;
}