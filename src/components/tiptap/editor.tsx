"use client";

import { Separator } from "@/components/ui/separator";
import { BlockquoteToolbar } from "./toolbars/blockquote";
import { BoldToolbar } from "./toolbars/bold";
import { BulletListToolbar } from "./toolbars/bullet-list";
import { CodeToolbar } from "./toolbars/code";
import { CodeBlockToolbar } from "./toolbars/code-block";
import { HardBreakToolbar } from "./toolbars/hard-break";
import { HorizontalRuleToolbar } from "./toolbars/horizontal-rule";
import { ItalicToolbar } from "./toolbars/italic";
import { OrderedListToolbar } from "./toolbars/ordered-list";
import { RedoToolbar } from "./toolbars/redo";
import { StrikeThroughToolbar } from "./toolbars/strikethrough";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import { SearchAndReplaceToolbar } from "./toolbars/search-and-replace-toolbar";
import SearchAndReplace from "./extensions/search-and-replace";
import { useServerActionMutation } from "@/lib/hooks/server-action-hooks";
import { updateVenueRulesFile } from "@/lib/actions/file";
import { toast } from "sonner";
import { UpdateVenueRulesSchemaWithPath } from "@/lib/schema/file";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    code: {
      HTMLAttributes: {
        class: "bg-accent rounded-md p-1",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "my-2",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: "tiptap-heading",
      },
    },
  }),
  SearchAndReplace,
];

export default function Editor({
  content,
  venueId,
}: {
  content: string | null | undefined;
  venueId: string;
}) {
  const pathname = usePathname();
  const editor = useEditor({
    extensions: extensions as Extension[],
    content,
    immediatelyRender: false,
  });

  const { mutateAsync, isPending } =
    useServerActionMutation(updateVenueRulesFile);

  if (!editor) {
    return null;
  }

  const editorContent = editor.getHTML();

  async function onSubmit() {
    if (!editorContent.trim() || editorContent === "<p></p>") {
      toast.error(
        "The editor is empty. Please add some content before saving."
      );
      return;
    }
    try {
      toast.promise(
        mutateAsync({
          path: pathname,
          venueId: venueId,
          text: editorContent,
        }),
        {
          loading: "Saving...",
          success: () => {
            return "Saved";
          },
          error: (err) => {
            console.log(err);
            return err.message;
          },
        }
      );
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred during submission. Please try again.");
    }
  }

  return (
    <div className="scroll-bar relative w-full max-w-4xl overflow-y-auto rounded-md border pb-3">
      <div className="sticky left-0 top-0 z-20 flex w-full items-center justify-between border-b bg-secondary px-2 py-2">
        <ToolbarProvider editor={editor}>
          <div className="flex items-center gap-2">
            <BoldToolbar />
            <ItalicToolbar />
            <StrikeThroughToolbar />
            <BulletListToolbar />
            <OrderedListToolbar />
            <CodeToolbar />
            <CodeBlockToolbar />
            <HorizontalRuleToolbar />
            <BlockquoteToolbar />
            <HardBreakToolbar />
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => onSubmit()}
              disabled={isPending || editorContent === content}
              size="sm"
            >
              Save Content
            </Button>
            <SearchAndReplaceToolbar />
          </div>
        </ToolbarProvider>
      </div>
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="min-h-[18rem] cursor-text bg-secondary"
      >
        <EditorContent className="outline-none" editor={editor} />
      </div>
    </div>
  );
}
