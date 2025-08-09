import { KITrick } from '@/lib/types/types';
import { StepCard, ExampleCard } from '@/components/molecules';
import { TableOfContents } from '@/components/molecules/TableOfContents';
import { ContentSection } from '@/components/molecules/ContentSection';

interface TrickContentProps {
  trick: KITrick;
}

export const TrickContent = ({ trick }: TrickContentProps) => {
  const tocItems = [];
  if (trick.steps && trick.steps.length > 0) {
    tocItems.push({ id: 'steps', title: 'Schritt-für-Schritt Anleitung' });
  }
  if (trick.examples && trick.examples.length > 0) {
    tocItems.push({ id: 'examples', title: 'Praktische Beispiele' });
  }

  return (
    <div className="space-y-12">
      {tocItems.length > 1 && (
        <section>
          <TableOfContents items={tocItems} />
        </section>
      )}

      {trick.steps && trick.steps.length > 0 && (
        <ContentSection
          id="steps"
          title="Schritt-für-Schritt Anleitung"
          icon={<span className="inline-block w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />}
          glowColor="primary"
        >
          {trick.steps.map((step, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 100}ms` }}
              className="animate-fadeInUp"
            >
              <StepCard step={step} number={index + 1} />
            </div>
          ))}
        </ContentSection>
      )}

      {trick.examples && trick.examples.length > 0 && (
        <ContentSection
          id="examples"
          title="Praktische Beispiele"
          icon={<span className="inline-block w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />}
          glowColor="purple"
        >
          {trick.examples.map((example, index) => (
            <div
              key={index}
              style={{ animationDelay: `${(trick.steps?.length || 0) * 100 + index * 100}ms` }}
              className="animate-fadeInUp"
            >
              <ExampleCard example={example} />
            </div>
          ))}
        </ContentSection>
      )}
    </div>
  );
};