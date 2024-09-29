
export interface PatientSummary {
    name: string;
    dob: Date;
    sex: string;
    patientid: string;
    adherence: AdherenceTrackingDay[];
}

interface MedicationTaken {

    medication: string;
    taken: boolean;

}

export interface AdherenceTrackingDay {
    date: Date;
    content: MedicationTaken[];
}

export interface AdherenceTrackingAPIResponse {
    adherence: AdherenceTrackingDay[];
    patientid: string;
}

export interface SearchResult {
    id: string;
    primary: string;
    secondary?: string;
    adherence?: AdherenceTrackingDay[];
}

export interface Patient {
    name: string;
    dob: Date;
    sex: string;
    patientid: string;
    height: number;
    weight: number;
}

export interface PatientMedicationInfo {
    date_collected: Date | null;
    description: string;
    dosage: number;
    duration: number;
    frequency: number;
    activeid: number;
    is_flexible_duration: boolean;
    last_taken: Date | null;
    name: string;
    patientid: number;
    quantity: number;
    remaining_quantity: number;
}

export interface PatientLog {
    date: Date;
    logsid: number;
    patientid: number;
    content: string;
}

export interface PatientHistory {
    historyid: number;
    patientid: number;
    date: Date;
    notes: string;
}

export interface MedicationSummary {
    name: string;
    description: string;
}