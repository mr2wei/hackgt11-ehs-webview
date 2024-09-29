import React, { useEffect, useState } from "react";
import { PlusCircleFill, ArrowUpRightSquareFill } from "react-bootstrap-icons";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { getAllPatients, searchPatients, logout } from "../utils/api";
import { PatientSummary } from "../types";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/home.css';
import SearchBox from "../components/search";
import MiniAdherence from "../components/miniAdherence";
import AddPatientModal from "../components/addPatientModal";

function Home({ isPrivileged }: { isPrivileged : boolean }) {
    const [patients, setPatients] = useState<PatientSummary[]>([]);
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            const patients = await getAllPatients();
            setPatients(patients);
        }

        fetchPatients()
    }, []);

    useEffect(() => {
        console.log(patients);
    }, [patients]);

    const handleLogout = async () => {
        await logout();
    };

    const handleAddPatient = () => {
        setShowAddPatientModal(true);
    };

    const handleCloseAddPatientModal = () => {
        setShowAddPatientModal(false);
    };

    const handlePatientAdded = async () => {
        setShowAddPatientModal(false);
        const patients = await getAllPatients();
        setPatients(patients);
    };

    return (
        <div className="container">
            <div className="user-details">
                {`Logged in as ${document.cookie.split('; ').find(row => row.startsWith('username='))?.split('=')[1]}`}
                <Button onClick={handleLogout}>Logout</Button> 
            </div>
            <div className="header">
                <h1>Patients</h1>
                <Button className="add-patient-button" onClick={handleAddPatient}><PlusCircleFill /></Button>
            </div>
            <SearchBox searchFunction={searchPatients} onSelect={(patient) => window.location.href = `/patient/${patient.id}`} />
            {isPrivileged && <ListGroup className="patient-list">
                {patients.map((patient) => (
                    <ListGroup.Item className="patient-item" key={patient.patientid} action href={`/patient/${patient.patientid}`}>
                        <div className="search-result">
                            <div className="main-info">
                                <div className="primary">{patient.name}</div>
                                <div className="secondary">{patient.dob.toLocaleDateString('en-US')}</div>
                            </div>
                            <div className="tertiary-info">
                                <MiniAdherence adherence={patient.adherence} />
                                <ArrowUpRightSquareFill />
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>}
            <AddPatientModal 
                show={showAddPatientModal} 
                handleClose={handleCloseAddPatientModal} 
                onPatientAdded={handlePatientAdded} 
            />
        </div>
    );
}

export default Home;