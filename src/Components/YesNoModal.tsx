import { MouseEventHandler, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  onDeny: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function YesNoModal({ isOpen, onConfirm, onDeny, children: child }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          width: 240,
          margin: 'auto',
          padding: '2%',
          border: '2px solid #000',
          borderRadius: '10px',
          boxShadow: '2px solid black',
        }}
      >
        {child}
        <div>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onDeny}>No</button>
        </div>
      </div>
    </div>
  );
};