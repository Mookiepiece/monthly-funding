<template>
  <button class="VButton">
    <slot />
  </button>
</template>

<style>
.VButton {
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 40px;
  padding: 0 10px;

  color: var(--text-1);
  background: var(--air-1);

  &:has(> svg:only-child) {
    padding-inline: 0;
    aspect-ratio: 1;
    justify-content: center;

    border-radius: 999px;
  }

  &:hover {
    background: var(--air-2);
  }
  &:active {
    filter: brightness(0.95);
  }
  &:focus-visible {
    outline: 2px solid var(---main);
  }
}
</style>
