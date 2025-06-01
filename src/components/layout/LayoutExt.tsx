// src\components\Layout\LayoutProtectedExt.tsx
import { LayoutPublic } from '@happykiller/sunny-ui';
import { Footer } from '@src/components/layout/Footer';

export function LayoutExt({ children }: { children: React.ReactNode }) {
  return (
    <LayoutPublic
      footer={<Footer/>}
    >
      {children}
    </LayoutPublic>
  );
}
