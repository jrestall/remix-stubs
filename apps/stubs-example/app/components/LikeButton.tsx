import { useFetcher, useFormAction } from "@remix-run/react";
import { Button } from "./Button";

export interface LikeButtonProps {
  label: string;
  liked: boolean;
  href: string;
}

export function LikeButton({ liked, label, href }: LikeButtonProps) {
  const fetcher = useFetcher();

  const onClick = () =>
    fetcher.submit(
      {
        liked: liked ? "true" : "false",
      },
      {
        method: "post",
        action: href,
      }
    );

  const isLiked = fetcher.submission
    ? // use the optimistic version
      Boolean(fetcher.submission.formData.get("liked"))
    : // use the normal version
      liked;

  return (
    <>
      <div>{label}</div>
      <Button label={isLiked ? "💗" : "🤍"} onClick={onClick} />
    </>
  );
}
