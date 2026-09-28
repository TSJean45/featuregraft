interface BackdropProps {
  visible: boolean;
  onClick: () => void;
}

export function Backdrop({ visible, onClick }: BackdropProps) {
  if (!visible) return null;
  return (
    <div
      className="backdrop"
      onClick={onClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 50,
        animation: "backdropIn 200ms ease forwards",
      }}
    />
  );
}
