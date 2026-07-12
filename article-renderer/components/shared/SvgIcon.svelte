<script lang="ts">
  import { config } from "../../config";

  type IconSizePresetKey =
    | "smaller"
    | "small"
    | "medium-small"
    | "default"
    | "medium-large"
    | "large"
    | "larger"
    | "largest";

  const iconsBasePath = `${config.staticUrl}/icons/`;

  const cssSizes: Record<IconSizePresetKey, string> = {
    smaller: "0.75rem",
    small: "0.9rem",
    "medium-small": "1.25rem",
    default: "1.5rem",
    "medium-large": "1.75rem",
    large: "2rem",
    larger: "2.5rem",
    largest: "3.5rem",
  };

  interface Props {
    size?: IconSizePresetKey;
    type: string;
    color?: string;
    inline?: boolean;
  }

  let {
    size = "default",
    type,
    color = "currentColor",
    inline = false,
  }: Props = $props();

  const iconUrl = $derived(`${iconsBasePath}${type}.svg`);

  const iconSize = $derived(
    inline ? "1em" : cssSizes[size]
  );
</script>

<span
  class="icon"
  class:inline-icon={inline}
  style:width={iconSize}
  style:height={iconSize}
  style:background-color={color}
  style:mask-image={`url("${iconUrl}")`}
  style:-webkit-mask-image={`url("${iconUrl}")`}
/>

<style>
    .icon {
        display: inline-block;
        flex-shrink: 0;

        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;

        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        -webkit-mask-size: contain;
    }

    .inline-icon {
        vertical-align: baseline;
        transform: translateY(-0.125em);
        margin-right: clamp(8px, 0.25em, 10px);
    }
</style>