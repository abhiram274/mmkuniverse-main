import React, { useState, useMemo, useRef } from 'react';

export default function AttendeesModal({ attendees, onClose, onMarkParticipated }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    const modalRef = useRef(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const [pos, setPos] = useState({ x: null, y: null });

    const itemsPerPage = 5;

    const filteredAttendees = useMemo(() => {
        return attendees.filter((a) => {
            const str = `${a.name ?? ''} ${a.guest_email ?? ''}`.toLowerCase();
            return str.includes(searchTerm.toLowerCase());
        });
    }, [attendees, searchTerm]);

    const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
    const paginatedAttendees = filteredAttendees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // const markSelected = () => {
    //     selectedIds.forEach((id) => {
    //         //   const att = attendees.find((a) => a.userId === id || a.guest_email === id);
    //         const att = attendees.find(
    //             (a) => a.user_id === id || a.guest_email === id
    //         );
    //         if (att && !att.participated) {
    //             onMarkParticipated(att.userId ?? null, att.guest_email ?? null);
    //         }
    //     });
    //     setSelectedIds([]);
    // };

    const markSelected = () => {
    selectedIds.forEach((id) => {
        // Find attendee by matching either user_id or guest_email to the selected ID
        const attendee = attendees.find(
            (a) => a.user_id === id || a.guest_email === id
        );

        if (!attendee || attendee.participated) return;

        // Call the marking function with correct params
        onMarkParticipated(
            attendee.user_id ?? null,
            attendee.guest_email ?? null
        );
    });

    setSelectedIds([]);
};

    

    const onMouseDown = (e) => {
        if (!modalRef.current) return;
        dragging.current = true;
        const rect = modalRef.current.getBoundingClientRect();
        offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;
        setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };

    const onMouseUp = () => {
        dragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    const initialStyle = pos.x === null || pos.y === null ? {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
    } : {
        top: pos.y,
        left: pos.x,
        transform: 'none',
        position: 'fixed',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div
                ref={modalRef}
                style={initialStyle}
                className="bg-white text-black w-[95%] max-w-2xl rounded-xl shadow-xl p-6 relative cursor-default select-none"
            >
                <div
                    className="cursor-move mb-4 font-bold text-xl"
                    onMouseDown={onMouseDown}
                    style={{ userSelect: 'none' }}
                >
                    Attendees
                </div>

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                {selectedIds.length > 0 && (
                    <div className="mb-2 text-sm text-blue-600">
                        {selectedIds.length} selected —{" "}
                        <button onClick={markSelected} className="underline text-green-600">
                            Clicl here to mark as participated
                        </button>
                    </div>
                )}

                <ul className="divide-y max-h-[300px] overflow-y-auto">
                    {paginatedAttendees.map((attendee) => {
                        const id = attendee.user_id ?? attendee.guest_email;
                        const displayName =
                            attendee.user_name || attendee.user_mail || attendee.guest_name || attendee.guest_email || "Unknown";

                        return (
                            <li
                                key={id}
                                className="py-2 flex justify-between items-center hover:bg-gray-100 px-2 rounded"
                            >
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(id)}
                                        onChange={() => toggleSelect(id)}
                                        disabled={attendee.participated} // Optional: disable if already marked
                                    />
                                    <span className="font-medium">{displayName}</span>
                                </label>

                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${attendee.participated
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {attendee.participated ? "Participated" : "Not Participated"}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-4 flex justify-between items-center text-sm">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
