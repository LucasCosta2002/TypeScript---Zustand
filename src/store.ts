import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { DraftPatient, Patient } from "./types";
import { v4 as uuidv4 } from 'uuid';

type PatientState = {
    patients: Patient[],
    activeId: Patient['id'],
    addPatient: (data: DraftPatient) => void,
    deletePatient: (id: Patient['id']) => void,
    getPatientById: (id: Patient['id']) => void,
    updatePatient: (data: DraftPatient) => void
}

const createPatient = (patient: DraftPatient) : Patient => {
    return { ...patient, id: uuidv4() }
}

export const usePatientStore = create<PatientState>()(
    devtools(
    persist(
            (set) => ({
            
                //state
                patients: [],
                activeId: '',
                //funciones que modifican al state

                addPatient: (data) => {
                    //darle el state para escribir en el y asignarle un id

                    set((state)=> ({
                        patients: [...state.patients, createPatient(data)]
                    }))
                },

                deletePatient: (id) => {
                    set( (state) => ({
                        patients: state.patients.filter( (patient) => patient.id !== id)
                    }));
                },

                getPatientById: (id) => {
                    set(() => ({
                        activeId: id
                    }));
                },

                updatePatient: (data) => {
                    set((state) => ({
                        //itero sobre los pacientes y almcaeno los datos del form en data
                        patients: state.patients.map((patient) => patient.id === state.activeId ? {id: state.activeId, ...data} : patient),
                        //volver a vaciar el activeId
                        activeId: ''
                    }))
                }

            }),{
                name: 'patient-storage'
            }
        )
    )
) 