export type Company = {
    id: number
    name: string
}

export type Product = {
    id: number;
    name: string;
    project_code: string | null
}

export type Incoming = {
    company_name: string;
    product_name: string;
    company_id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
}

export type Process = {
    company_name: string;
    product_name: string;
    company_id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
}

export type Store = {
    company_name: string;
    product_name: string;
    company_id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
}

export type TotalIncoming = {
    company_name: string;
    product_name: string;
    company_id: number;
    product_id: number;
    mass: number;
    created_at: Date;
}

export type Assignment = {
    assignment_id: number
    company_name: string;
    product_name: string;
    company_id: number;
    product_id: number;
    quantity: number;
    user_id: number,
    user_name: string,
    last_date_completion: Date;
    completed_quantity: number
}

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
}

export type OperationPostBody = {
    company_id: number;
    product_id: number;
    quantity: number;
}

export type TotalIncomingPostBody = {
    company_id: number;
    product_id: number;
    mass: number;
}

export type ListModalProps = {
    company_id: number;
    product_id: number;
    isAdmin?: boolean;
    fromAssignments?: boolean
    assignment_id?: number
    visible: boolean;
    onDismiss: () => void;
};

export type GraphProps = {
    api_url: string;
    graphType: "monthly" | "yearly"
};

export type AcidBath = {
    pool_number: number
    company_name: string
    product_name: string
    remaining_time: number
    is_active: boolean
}

export type TotalPerformanceType = {
    company_name: string
    product_name: string
    total_time_minutes: number
}

export type UnitPerformanceType = {
    company_name: string
    product_name: string
    avg_minutes_per_unit: string
}

export type GraphScreenProps = {
    email: string
}