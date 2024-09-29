import React, { useEffect, useState } from "react";
import { AdherenceTrackingDay } from "../types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import '../styles/adherenceTracker.css';

interface AdherenceTrackerProps {
    adherence: AdherenceTrackingDay[];
}

interface AdherenceTrackerCell {
    percentage: number;
    date: Date;
    medsMissed: number;
}

function AdherenceTracker({ adherence }: AdherenceTrackerProps) {
    const [adherenceGrid, setAdherenceGrid] = useState<AdherenceTrackerCell[][]>([]);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        // Helper function to format dates
        const formatDate = (date: Date | string): string => {
            const d = date instanceof Date ? date : new Date(date);
            return d.toISOString().split('T')[0];
        };
    
        const adherenceMap = new Map(
            adherence.map((day) => [formatDate(day.date), day])
        );
    
        const today = new Date();
        const lastDate = new Date(today);
        lastDate.setDate(today.getDate() - 29); // 30 days ago
    
        // Find the Sunday on or before lastDate
        const startDate = new Date(lastDate);
        startDate.setDate(lastDate.getDate() - lastDate.getDay());
    
        const oneDayMs = 1000 * 60 * 60 * 24;
    
        // Calculate total days and weeks
        const totalDays =
            Math.ceil((today.getTime() - startDate.getTime()) / oneDayMs) + 1;
        const totalWeeks = Math.ceil(totalDays / 7);
    
        // Initialize gridData with default values
        const gridData: Array<
            Array<{ percentage: number; date: Date; medsMissed: number }>
        > = Array.from({ length: 7 }, (_, dayIndex) =>
            Array.from({ length: totalWeeks }, (_, weekIndex) => {
                const date = new Date(
                    startDate.getTime() + (weekIndex * 7 + dayIndex) * oneDayMs
                );
                return {
                    percentage: -1,
                    date,
                    medsMissed: 0,
                };
            })
        );
    
        // Populate gridData with actual adherence data
        gridData.forEach((row, dayOfWeek) => {
            row.forEach((cell, weekIndex) => {
                const dateString = formatDate(cell.date);
                const dayData = adherenceMap.get(dateString);
                if (dayData) {
                    const takenCount = dayData.content.filter((med) => med.taken)
                        .length;
                    const totalMeds = dayData.content.length;
                    const percentage = takenCount / totalMeds;
                    const medsMissed = totalMeds - takenCount;
    
                    gridData[dayOfWeek][weekIndex] = {
                        percentage,
                        date: cell.date,
                        medsMissed,
                    };
                }
            });
        });
    
        setAdherenceGrid(gridData);
    }, [adherence]);
    
    
    return (
        <div className="adherence-tracker-grid">
            {adherenceGrid.map(
                (rowData: Array<{ percentage: number; date: Date; medsMissed: number }>, dayIndex: number) => (
                    <div key={dayIndex} className="adherence-tracker-row">
                        <div className="adherence-day-label">{days[dayIndex]}</div>
                        {rowData.map((cellData, weekIndex) => {
                            const { percentage, date, medsMissed } = cellData;
                            const dateString = date.toDateString();
    
                            return date > new Date() ? (
                                <div
                                    key={weekIndex}
                                    className={`adherence-day future-date`}
                                ></div>
                            ) : (
                                <OverlayTrigger
                                    key={weekIndex}
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-${dayIndex}-${weekIndex}`}>
                                            {percentage === -1
                                                ? <div>{dateString}: No data</div>
                                                : <><div>{dateString}</div><div>{medsMissed} medication(s) missed</div></>}
                                        </Tooltip>
                                    }
                                >
                                    <div
                                        className={`adherence-day ${
                                            percentage === -1
                                                ? 'no-data'
                                                : percentage < 0.33
                                                ? 'low-adherence'
                                                : percentage < 0.66
                                                ? 'med-adherence'
                                                : 'high-adherence'
                                        } `}
                                    ></div>
                                </OverlayTrigger>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
    
}

export default AdherenceTracker;
