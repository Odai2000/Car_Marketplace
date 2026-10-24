// ai generated
import React from "react";
import Chip from "../../Chip/Chip";

const STATUS_META = {
    online: {
        label: "Online",
        type: "success",
        color: "var(--success)",
    },
    offline: {
        label: "Offline",
        type: "default",
        color: "var(--neutral-gray)",
    },
    banned: {
        label: "Banned",
        type: "error",
        color: "var(--danger)",
    },
};

const StatusChip = ({
    status = "offline",
    label,
    className = "",
    style = {},
    ...props
}) => {
    const meta = STATUS_META[status] ?? STATUS_META.offline;
    const chipLabel = label ?? meta.label;

    return (
        <Chip
            className={`flex items-center ${className}`.trim()}
            type={meta.type}
            style={{
                fontWeight: 800,
                gap: "0.25em",
                ...style,
            }}
            {...props}
        >
            <span
                aria-hidden="true"
                style={{
                    background: meta.color,
                    width: ".75em",
                    height: ".75em",
                    borderRadius: "64px",
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
            {chipLabel}
        </Chip>
    );
};

export default StatusChip;