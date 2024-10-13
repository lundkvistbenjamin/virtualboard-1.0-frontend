interact('.note')
    .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true
            })
        ],
        autoScroll: true,

        listeners: {
            move: dragMoveListener,

            end(event) {
                // Get the final coordinates
                const droppedX = event.target.getAttribute('data-x');
                const droppedY = event.target.getAttribute('data-y');
                const noteId = event.target.id;

                // Create and dispatch a custom event with the coordinates
                const moveEvent = new CustomEvent('noteMoved', {
                    detail: {
                        noteId: noteId,
                        x: droppedX,
                        y: droppedY
                    }
                });

                // Dispatch the event
                window.dispatchEvent(moveEvent);
            }
        }
    });

function dragMoveListener(event) {
    const target = event.target;

    // Keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // Translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // Update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
