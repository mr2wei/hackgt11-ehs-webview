import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { MedicationSummary, PatientMedicationInfo } from '../types';
import { prescribeMedication, getAvailableMedications } from '../utils/api';

interface MedicationModalProps {
    show: boolean;
    handleClose: () => void;
    patientId: string | undefined;
    medicationInfo: PatientMedicationInfo | null;
    readOnly: boolean;
}

const MedicationModal: React.FC<MedicationModalProps> = ({ show, handleClose, patientId, medicationInfo, readOnly }) => {
    const [medication, setMedication] = useState<PatientMedicationInfo>({
        activeid: 0,
        name: '',
        dosage: 0,
        description: '',
        duration: 0,
        frequency: 0,
        quantity: 0,
        remaining_quantity: 0,
        date_collected: new Date(),
        is_flexible_duration: false,
        last_taken: new Date(),
        patientid: 0
    });
    const [availableMedications, setAvailableMedications] = useState<MedicationSummary[]>([]);

    useEffect(() => {
        const fetchAvailableMedications = async () => {
            const medications = await getAvailableMedications();    
            setAvailableMedications(medications);
        }

        fetchAvailableMedications();
    }, []);

    useEffect(() => {
        if (show) {
            if (medicationInfo) {
                setMedication(medicationInfo);
            } else {
                setMedication({
                    activeid: 0,
                    name: '',
                    dosage: 0,
                    description: '',
                    duration: 0,
                    frequency: 0,
                    quantity: 0,
                    remaining_quantity: 0,
                    date_collected: new Date(),
                    is_flexible_duration: false,
                    last_taken: new Date(),
                    patientid: 0
                });
            }
        }
    }, [show, medicationInfo]);

    if (!patientId) {
        return null;
    }

    const handlePrescribe = async () => {
        await prescribeMedication(patientId, medication);
        handleClose();
    }

    const handleChange = (field: keyof PatientMedicationInfo, value: any) => {
        if (!readOnly) {
            setMedication(prevState => ({
                ...prevState,
                [field]: value
            }));
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Medication Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="medicationName">
                                <Form.Label><strong>Name:</strong></Form.Label>
                                <Form.Control 
                                    as="select" 
                                    readOnly={readOnly} 
                                    value={medication.name} 
                                    onChange={(e) => handleChange('name', e.target.value)}
                                >
                                    <option value="">Select Medication</option>
                                    {availableMedications.map((med) => (
                                        <option key={med.name} value={med.name}>{med.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="medicationDosage">
                                <Form.Label><strong>Dosage (mg):</strong></Form.Label>
                                <Form.Control 
                                    type="text" 
                                    readOnly={readOnly} 
                                    value={medication.dosage} 
                                    onChange={(e) => handleChange('dosage', parseFloat(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    {readOnly && (<Form.Group controlId="medicationDescription">
                        <Form.Label><strong>Description:</strong></Form.Label>
                        <Form.Control 
                            type="text" 
                            readOnly={readOnly} 
                            value={medication.description} 
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </Form.Group>)}
                    <Row>
                        <Col>
                            <Form.Group controlId="medicationDuration">
                                <Form.Label><strong>Duration (days):</strong></Form.Label>
                                <Form.Control 
                                    type="text" 
                                    readOnly={readOnly} 
                                    value={medication.duration} 
                                    onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="medicationFrequency">
                                <Form.Label><strong>Frequency (times per day):</strong></Form.Label>
                                <Form.Control 
                                    type="text" 
                                    readOnly={readOnly} 
                                    value={medication.frequency} 
                                    onChange={(e) => handleChange('frequency', parseInt(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="medicationQuantity">
                                <Form.Label><strong>Quantity:</strong></Form.Label>
                                <Form.Control 
                                    type="text" 
                                    readOnly={readOnly} 
                                    value={medication.quantity} 
                                    onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        {readOnly && (
                            <Col>
                                <Form.Group controlId="medicationRemainingQuantity">
                                    <Form.Label><strong>Remaining Quantity:</strong></Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        readOnly 
                                        value={medication.remaining_quantity} 
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="medicationDateCollected">
                                <Form.Label><strong>Date Collected:</strong></Form.Label>
                                <Form.Control 
                                    type="date" 
                                    readOnly={readOnly} 
                                    value={medication.date_collected ? medication.date_collected.toISOString().substr(0, 10) : ''} 
                                    onChange={(e) => handleChange('date_collected', new Date(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        {readOnly && (
                            <Col>
                                <Form.Group controlId="medicationLastTaken">
                                    <Form.Label><strong>Last Taken:</strong></Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        readOnly 
                                        value={medication.last_taken ? medication.last_taken.toLocaleDateString() : 'N/A'} 
                                    />
                                </Form.Group>
                            </Col>
                        )}
                        <Col>
                            <Form.Group controlId="medicationFlexibleDuration">
                                <Form.Check
                                    type="checkbox"
                                    label="Flexible Duration"
                                    readOnly={readOnly}
                                    checked={medication.is_flexible_duration}
                                    onChange={(e) => handleChange('is_flexible_duration', e.target.checked)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {!readOnly && (
                    <Button variant="primary" onClick={handlePrescribe}>
                        Prescribe
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default MedicationModal;
