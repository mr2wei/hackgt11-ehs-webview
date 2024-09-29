import React, { useEffect, useState } from "react";
import { AdherenceTrackingDay } from "../types";
import '../styles/miniAdherence.css';

interface MiniAdherenceProps {
    adherence: AdherenceTrackingDay[];
}

function MiniAdherence({ adherence }: MiniAdherenceProps) {
    const [ adherencePercentage, setAdherencePercentage ] = useState<number[]>([]);

    useEffect(() => {
        const percentages = adherence.map((day) => {
            const takenCount = day.content.filter((med) => med.taken).length;
            return takenCount / day.content.length;
        });

        setAdherencePercentage(percentages);
    }, [adherence]);


    return (
        <div className="mini-adherence-tracker">
            {adherence.map((day, index) => (
                <div 
                    key={day.date.toISOString()} 
                    className={`mini-adherence-day ${
                        adherencePercentage[index] < 0.33 
                            ? 'low-adherence' 
                            : adherencePercentage[index] < 0.66 
                            ? 'med-adherence' 
                            : 'high-adherence'
                    }`}
                >
                </div>
            ))}
        </div>
    );
}

export default MiniAdherence;