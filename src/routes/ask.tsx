import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ConfidenceBadge,
  EvidencePanel,
  PageHeader,
  Panel,
  PanelHeader,
} from "@/components/carbon/primitives";
import { askCarbonAnswers } from "@/lib/carbon-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title: "Ask Carbon · Carbon Autopilot" },
      {
        name: "description",
        content: "Evidence-grounded carbon operations assistant backed by the prototype dataset.",
      },
    ],
  }),
  component: AskRoute,
});

function AskRoute() {
  const [question, setQuestion] = useState(askCarbonAnswers[0]?.question ?? "");
  const [evidenceOpen, setEvidenceOpen] = useState(true);
  const answer = useMemo(
    () => askCarbonAnswers.find((item) => item.question === question) ?? askCarbonAnswers[0],
    [question],
  );

  if (!answer) return null;

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <PageHeader title="Ask Carbon" subtitle="Answers are grounded in Carbon Autopilot data." />

      <Panel>
        <PanelHeader title="Suggested questions" subtitle="Tap a prompt to populate the analysis" />
        <div className="flex flex-wrap gap-2 p-5">
          {askCarbonAnswers.map((item) => (
            <button
              key={item.question}
              onClick={() => setQuestion(item.question)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition-colors",
                item.question === answer.question
                  ? "border-primary/35 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {item.question}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <PanelHeader title="Conversation" subtitle="Prototype response with visible provenance" />
          <div className="space-y-4 p-5">
            <div className="rounded-md border border-border bg-elevated/50 p-4">
              <p className="label-xs">User</p>
              <p className="mt-2 text-sm text-foreground">{answer.question}</p>
            </div>
            <div className="rounded-md border border-primary/25 bg-primary/8 p-4">
              <p className="label-xs">Assistant</p>
              <p className="mt-2 text-base leading-7 font-medium text-foreground">
                {answer.summary}
              </p>
            </div>
            <div>
              <p className="label-xs">Likely explanation</p>
              <p className="mt-2 text-sm text-foreground">{answer.explanation}</p>
            </div>
            <div>
              <p className="label-xs">Recommended action</p>
              <p className="mt-2 text-sm font-medium text-foreground">{answer.recommendation}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ConfidenceBadge level={answer.confidence} />
              <p className="text-xs text-muted-foreground">
                Sources · {answer.sources.join(" · ")}
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Evidence"
            subtitle="Every numerical claim stays tied to visible source signals"
            right={
              <Button size="sm" variant="outline" onClick={() => setEvidenceOpen((open) => !open)}>
                {evidenceOpen ? "Collapse" : "Expand"}
              </Button>
            }
          />
          <div className="p-5">
            {evidenceOpen ? (
              <EvidencePanel items={answer.evidence} sources={answer.sources.join(" · ")} />
            ) : (
              <div className="rounded-md border border-border bg-elevated/40 px-4 py-6 text-sm text-muted-foreground">
                Evidence is collapsed. Expand to review the supporting signals behind this answer.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
