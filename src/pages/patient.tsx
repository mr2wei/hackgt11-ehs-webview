import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdherenceTrackingDay, Patient, PatientMedicationInfo, PatientLog, PatientHistory } from "../types";
import { getPatient, getPatientAdherence, getPatientHistory, getPatientMedications, getPatientLogs } from "../utils/api";
import '../styles/patient.css';
import { ListGroup, Form, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdherenceTracker from "../components/adherenceTracker";
import MedicationModal from "../components/medicationModal";
import { PlusCircleFill } from "react-bootstrap-icons";

export default function PatientPage() {
    const { patientId } = useParams();

    const [patient, setPatient] = useState<Patient | null>(null);
    const [patientAdherence, setPatientAdherence] = useState<AdherenceTrackingDay[]>([]);
    const [patientMedications, setPatientMedications] = useState<PatientMedicationInfo[]>([]);
    const [patientHistory, setPatientHistory] = useState<PatientHistory[]>([]);
    const [PatientLogs, setPatientLogs] = useState<PatientLog[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState<PatientMedicationInfo | null>(null);


    const fetchPatient = async (patientId: string) => {
        const patient = await getPatient(patientId);
        setPatient(patient);
    }

    const fetchAdherence = async (patientId: string) => {
        const adherence = await getPatientAdherence(patientId);
        setPatientAdherence(adherence);
    }

    const fetchMedications = async (patientId: string) => {
        const medications = await getPatientMedications(patientId);
        setPatientMedications(medications);
    }

    const fetchPatientLogs = async (patientId: string) => {
        const logs = await getPatientLogs(patientId);
        setPatientLogs(logs);
    }

    const fetchHistory = async (patientId: string) => {
        const history = await getPatientHistory(patientId);
        setPatientHistory(history);
    }

    useEffect(() => {
        if (!patientId) {
            // Redirect to home page if no patientId is provided
            window.location.href = '/home';
        } else {
            fetchPatient(patientId);
            fetchAdherence(patientId);
            fetchMedications(patientId);
            fetchPatientLogs(patientId);
            fetchHistory(patientId);
        }
    }, [patientId]);

    const handleMedicationClick = (medication: PatientMedicationInfo) => {
        setSelectedMedication(medication);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMedication(null);
        patientId && fetchMedications(patientId);
    };

    return (
        <div className="container patient-page">
            <div className="half-page-content">
                <div className="patient-details patient-info-container">
                    <h2>Patient Details</h2>
                    {patient && (
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" readOnly defaultValue={patient.name} />
                            </Form.Group>
                            <Form.Group controlId="formDob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="text" readOnly defaultValue={patient.dob.toLocaleDateString('en-US')} />
                            </Form.Group>
                            <Form.Group controlId="formSex">
                                <Form.Label>Sex</Form.Label>
                                <Form.Control type="text" readOnly defaultValue={patient.sex} />
                            </Form.Group>
                            <Form.Group controlId="formPatientId">
                                <Form.Label>Patient ID</Form.Label>
                                <Form.Control type="text" readOnly defaultValue={patient.patientid} />
                            </Form.Group>
                            <Form.Group controlId="formHeight">
                                <Form.Label>Height</Form.Label>
                                <Form.Control type="text" readOnly defaultValue={`${patient.height} cm`} />
                            </Form.Group>
                            <Form.Group controlId="formWeight">
                                <Form.Label>Weight</Form.Label>
                                <Form.Control type="text" readOnly defaultValue={`${patient.weight} kg`} />
                            </Form.Group>
                        </Form>
                    )}
                </div>
                <div className="patient-added-notes patient-info-container">
                    <h2>Patient Added Notes</h2>
                    <ListGroup className="patient-view-list">
                        {PatientLogs.length === 0 && <div>No patient added logs</div>}
                        {PatientLogs.map((log) => (
                            <ListGroup.Item key={log.logsid} className="patient-view-container">
                                <div className="log-content">{log.content}</div>
                                <div className="log-date">{log.date.toLocaleDateString()}</div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
            <div className="half-page-content">
            <div className="adherence-tracker patient-info-container">
                <h2>Adherence Tracker</h2>
                    <AdherenceTracker adherence={patientAdherence} />
                </div>
                <div className="history patient-info-container">
                    <h2>History</h2>
                    <ListGroup className="patient-view-list">
                        {patientHistory.length === 0 && <div>No history</div>}
                        {patientHistory.map((history) => (
                            <ListGroup.Item key={history.historyid} className="patient-view-container">
                                <div className="history-notes">{history.notes}</div>
                                <div className="history-date">{history.date.toLocaleDateString()}</div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
                <div className="active-meds patient-info-container">
                    <h2>Active Medications</h2>
                    <ListGroup className="patient-view-list">
                        {patientMedications.length === 0 && <div>No active medications</div>}
                        {patientMedications.map((medication) => (
                            <ListGroup.Item 
                                key={medication.activeid} 
                                className="patient-view-container" 
                                action 
                                onClick={() => handleMedicationClick(medication)}
                            >
                                <div className="medication-info">
                                    <div className="medication-name-dosage">{medication.name} - {medication.dosage} mg</div>
                                </div>
                                <div className="medication-remaining">Remaining: {medication.remaining_quantity}</div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Button className="add-medication-button" onClick={() => {
                        setSelectedMedication(null);
                        setShowModal(true);
                    }}>
                        <PlusCircleFill /> Add Medication
                        </Button>
                </div>
            </div>
            <MedicationModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                patientId={patientId}
                medicationInfo={selectedMedication} 
                readOnly={selectedMedication ? true : false}
            />
        </div>
    );
}