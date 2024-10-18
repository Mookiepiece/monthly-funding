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
  height: 30px;
  padding-inline: 10px;

  background: #f8f8f8;

  &:has(> svg:only-child) {
    padding-inline: 0;
    aspect-ratio: 1;
    justify-content: center;

    border-radius: 999px;
  }

  &:hover {
    background: #e8e8e8;
  }
  &:active {
    filter: brightness(.95);
  }
}
</style>
