import { useFetcher } from "@remix-run/react";

export interface LikeButtonProps {
  label: string;
  liked: boolean;
  action: string;
}

export function LikeButton({ liked, label, action }: LikeButtonProps) {
  let fetcher = useFetcher();
  let isLiked = fetcher.submission?.formData?.get("liked") ?? liked;
  return (
    <fetcher.Form method="post" action={action}>

      {/* jsdom doesn't support passing the value of the form submit button since
          it filters out all buttons from form data in the following code.
          https://github.com/jsdom/jsdom/blob/e285763ebf46bbc9c883a519c9a18231f5ede9d8/lib/jsdom/living/xhr/FormData-impl.js#L109 */}
      <input type="hidden" name="liked" value={isLiked ? "false" : "true"} />
      
      <button
        aria-label={label}
        name="liked"
        value={isLiked ? "false" : "true"}
        type="submit"
      >
        {isLiked ? "♥" : "♡"}
      </button>
    </fetcher.Form>
  );
}
