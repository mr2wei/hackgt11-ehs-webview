import axios from './axiosConfig';
import { Patient, PatientSummary, AdherenceTrackingDay, SearchResult, PatientMedicationInfo, AdherenceTrackingAPIResponse, PatientLog, PatientHistory, MedicationSummary, loginResponse } from '../types';

export const login = async (username: string, password: string): Promise<loginResponse> => {
    try {
        // Convert the payload to URL-encoded form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        console.log(response.data);
        if (response.status === 200){
            // add username to cookie
            document.cookie = `username=${username}`;
        }
        return {is_logged_in: response.status === 200, is_doctor: response.data.is_doctor};
    } catch (error) {
        console.error(error);
        return {is_logged_in: false, is_doctor: false};
    }
}

export const checkLogin = async () : Promise<loginResponse> => {
    // redirect to login page if not logged in

    // if username is not in cookie, redirect to login page
    if (!document.cookie.split('; ').find(row => row.startsWith('username='))) {
        // window.location.href = '/login';
        return {is_logged_in: false, is_doctor: false};
    }

    try {
        const response = await axios.get('/check_login');
        if (!response.data.is_logged_in) {
            console.log(response.data);
            // window.location.href = '/login';
            return {is_logged_in: false, is_doctor: false};
        } else {
            console.log('Logged in');
            return {is_logged_in: true, is_doctor: response.data.is_doctor};
        }
    } catch (error) {
        console.error(error);
        // window.location.href = '/login';
        return {is_logged_in: false, is_doctor: false};
    }

    // // do nothing for now
    // console.log('Logged in');
}

export const logout = async () => {
    try {
        const response = await axios.get('/logout');
        if (response.status === 200) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error(error);
    }
}

export const getAllPatients = async (): Promise<PatientSummary[]> => {
    try {
        const response = await axios.get('/patients');

        // convert the date strings to Date objects

        response.data.forEach((patient: PatientSummary) => {
            patient.dob = new Date(patient.dob);
            patient.adherence?.forEach((day: AdherenceTrackingDay) => {
                day.date = new Date(day.date);
            });
        });


        return response.data;
    }
    catch (error) {
        console.error(error);
        return [];
    }

    // return dummy data for now
    // return await new Promise<PatientSummary[]>((resolve) => {
    //     setTimeout(() => {
    //         resolve([
    //             {
    //                 name: 'John Doe',
    //                 dob: new Date("2003-09-28T10:00:00"),
    //                 sex: 'male',
    //                 patientid: '1234',
    //                 adherence: [
    //                     {
    //                       content: [
    //                         {
    //                           medication: "Panadol",
    //                           taken: true
    //                         },
    //                         {
    //                           medication: "Panadol",
    //                           taken: true
    //                         },
    //                         {
    //                           medication: "Panadol",
    //                           taken: true
    //                         }
    //                       ],
    //                       date: new Date("2024-09-26")
    //                     },
    //                     {
    //                       content: [
    //                         {
    //                           medication: "Panadol",
    //                           taken: false
    //                         },
    //                         {
    //                           medication: "Panadol",
    //                           taken: false
    //                         },
    //                         {
    //                           medication: "Panadol",
    //                           taken: true
    //                         }
    //                       ],
    //                       date: new Date("2024-09-25")
    //                     },
    //                     {
    //                       content: [
    //                         {
    //                           medication: "Panadol",
    //                           taken: true
    //                         },
    //                         {
    //                           medication: "Panadol",
    //                           taken: false
    //                         },
    //                         {
    //                           medication: "Panadol",
    //                           taken: true
    //                         }
    //                       ],
    //                       date: new Date("2024-09-24")
    //                     }
    //                 ]
    //             },
    //             {
    //                 name: 'Jane Doe',
    //                 dob: new Date("2003-09-28T10:00:00"),
    //                 sex: 'female',
    //                 patientid: '5678',
    //                 adherence: [],
    //             },
    //         ]);
    //     }, 800); 
    // });
}

export const searchPatients = async (name: string): Promise<SearchResult[]> => {
    try {
        const response = await axios.get<PatientSummary[]>(`/search_patients?name=${encodeURIComponent(name)}`); // Corrected the query parameter
        // add adherence to each patient to match the PatientSummary type
        response.data.forEach((patient: PatientSummary) => {
            patient.adherence = [];
        });

        // convert the date strings to Date objects
        response.data.forEach((patient: PatientSummary) => {
            patient.dob = new Date(patient.dob);
        });

        console.log(response.data);

        return response.data.map((patient) => ({
            id: patient.patientid,
            primary: patient.name,
            secondary: patient.dob.toLocaleDateString('en-US'),
            adherence: patient.adherence,
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
 

    // try {
    //     const response = await new Promise<{ data: PatientSummary[] }>((resolve) => {
    //         setTimeout(() => {
    //             resolve({
    //                 data: [
    //                     {
    //                         patientid: '1234',
    //                         name: 'John Doe',
    //                         dob: new Date('1990-01-01'),
    //                         sex: 'Male',
    //                         adherence: [],
    //                     },
    //                     {
    //                         patientid: '5678',
    //                         name: 'Jane Doe',
    //                         dob: new Date('1990-02-02'),
    //                         sex: 'Female',
    //                         adherence: [],
    //                     },
    //                 ],
    //             });
    //         }, 800); 
    //     });
    //     return response.data.map((patient) => ({
    //         id: patient.patientid,
    //         primary: patient.name,
    //         secondary: patient.dob.toLocaleDateString('en-US'),
    //         adherence: patient.adherence,
    //     }));
    // } catch (error) {
    //     console.error('Error fetching search results:', error);
    //     return [];
    // }
}

export const getPatient = async (patientid: string): Promise<Patient | null> => {
    try {
        const response = await axios.get(`/patient/${patientid}`);
        
        // convert the date strings to Date objects
        response.data.dob = new Date(response.data.dob);

        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }

    // return dummy data for now
    // return await new Promise<Patient>((resolve) => {
    //     setTimeout(() => {
    //         resolve({
    //             name: 'John Doe',
    //             dob: new Date("2003-09-28T10:00:00"),
    //             sex: 'Male',
    //             patientid: '1234',
    //             height: 180,
    //             weight: 75,
    //             allergies: ['Peanuts'],
    //             insurance: 'HealthCare Plus'
    //         });
    //     }, 800); 
    // });
}

export const getPatientAdherence = async (patientid: string): Promise<AdherenceTrackingDay[]> => {
    // try {
    //     const response = await axios.get<AdherenceTrackingAPIResponse>(`/adherence/${patientid}`);
    //     response.data.adherence.forEach((day: AdherenceTrackingDay) => {
    //         day.date = new Date(day.date);
    //     });
    //     return response.data.adherence;
    // } catch (error) {
    //     console.error(error);
    //     return [];
    // }

    // return dummy data for now
    return await new Promise<AdherenceTrackingDay[]>((resolve) => {
        setTimeout(() => {
            const adherenceTrackingDays: AdherenceTrackingDay[] = [];
            for (let i = 0; i < 30; i++) {
                adherenceTrackingDays.push({
                    content: [
                        {
                            medication: "Panadol",
                            taken: Math.random() > 0.5
                        },
                        {
                            medication: "Panadol",
                            taken: Math.random() > 0.5
                        },
                        {
                            medication: "Panadol",
                            taken: Math.random() > 0.5
                        }
                    ],
                    date: new Date(new Date().setDate(new Date().getDate() - i))
                });
            }
            resolve(adherenceTrackingDays);
        }, 300); 
    });
}

export const getPatientMedications = async (patientid: string): Promise<PatientMedicationInfo[]> => {
    try {
        const response = await axios.get(`/patient_meds/${patientid}`);

        // convert the date strings to Date objects
        response.data.forEach((medication: PatientMedicationInfo) => {
            if (medication.date_collected) {
                medication.date_collected = new Date(medication.date_collected);
            }
            if (medication.last_taken) {
                medication.last_taken = new Date(medication.last_taken);
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }

    // return dummy data for now
    // return await new Promise<PatientMedicationInfo[]>((resolve) => {
    //     setTimeout(() => {
    //         resolve([
    //             {
    //                 date_collected: new Date("2024-09-26"),
    //                 description: 'Panadol',
    //                 dosage: 500,
    //                 duration: 5,
    //                 frequency: 3,
    //                 id: 1,
    //                 is_flexible_duration: false,
    //                 last_taken: new Date("2024-09-26"),
    //                 name: 'Panadol',
    //                 patientid: 1234,
    //                 quantity: 10,
    //                 remaining_quantity: 5,
    //             },
    //             {
    //                 date_collected: new Date("2024-09-26"),
    //                 description: 'Panadol',
    //                 dosage: 500,
    //                 duration: 5,
    //                 frequency: 3,
    //                 id: 2,
    //                 is_flexible_duration: false,
    //                 last_taken: new Date("2024-09-26"),
    //                 name: 'Panadol',
    //                 patientid: 1234,
    //                 quantity: 10,
    //                 remaining_quantity: 5,
    //             },
    //             {
    //                 date_collected: new Date("2024-09-26"),
    //                 description: 'Panadol',
    //                 dosage: 500,
    //                 duration: 5,
    //                 frequency: 3,
    //                 id: 3,
    //                 is_flexible_duration: false,
    //                 last_taken: new Date("2024-09-26"),
    //                 name: 'Panadol',
    //                 patientid: 1234,
    //                 quantity: 10,
    //                 remaining_quantity: 5,
    //             },
    //         ]);
    //     }, 800); 
    // });
}
    
export const getPatientLogs = async (patientid: string): Promise<PatientLog[]> => {
    try {
        const response = await axios.get(`/get_logs/${patientid}`);
        // convert the date strings to Date objects
        response.data.forEach((log: PatientLog) => {
            log.date = new Date(log.date);
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const getPatientHistory = async (patientid: string): Promise<PatientHistory[]> => {
    try {
        const response = await axios.get(`/history/${patientid}`);
        // convert the date strings to Date objects
        console.log(response.data);
        response.data.forEach((log: PatientLog) => {
            log.date = new Date(log.date);
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const prescribeMedication = async (patientid: string, medication: PatientMedicationInfo): Promise<boolean> => {
    try {
        const formData = new FormData();

        console.log(medication);
        formData.append('name', medication.name);
        formData.append('dosage', medication.dosage.toString());
        formData.append('frequency', medication.frequency.toString());
        formData.append('quantity', medication.quantity.toString());
        formData.append('is_flexible_duration', medication.is_flexible_duration.toString());
        formData.append('duration', medication.duration.toString());

        const response = await axios.post(`/prescribe/${patientid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const getAvailableMedications = async (): Promise<MedicationSummary[]> => {
    try {
        const response = await axios.get('/all_medicines');
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addPatient = async (username: string, patientInfo: Patient): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('name', patientInfo.name);
        formData.append('dob', patientInfo.dob.toISOString());
        formData.append('sex', patientInfo.sex);
        formData.append('height', patientInfo.height.toString());
        formData.append('weight', patientInfo.weight.toString());

        const response = await axios.post('/add_patient', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const setMedicationTaken = async (activeid: number): Promise<boolean> => {
    try {
        const response = await axios.post(`/pickup_meds/${activeid}`);
        return response.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}