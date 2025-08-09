import React from 'react';

interface ContentSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  glowColor?: string;
}

export const ContentSection = ({ id, title, icon, children, glowColor = 'primary' }: ContentSectionProps) => {
  const glowClasses: { [key: string]: string } = {
    primary: 'from-primary-500/5',
    purple: 'from-purple-500/5',
  };

  return (
    <section id={id} className="relative scroll-mt-20">
      <div className={`absolute -inset-4 bg-gradient-to-b ${glowClasses[glowColor]} to-transparent blur-3xl rounded-3xl pointer-events-none`} />
      <div className="relative">
        <h2 className="text-2xl font-bold text-neutral-100 mb-6 flex items-center gap-3">
          {icon}
          {title}
        </h2>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
};