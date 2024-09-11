<template>
  <div class="specimens">
    <h2>Button classification</h2>
    <div class="specimen">
      <h3>Button</h3>
      <FormulateInput
        label="Click me"
        type="button"
        @click="() => console.log('clicked Click me')"
      />
    </div>
    <div class="specimen">
      <h3>Submit</h3>
      <FormulateInput
        label="Submit me"
        type="submit"
        @click="() => console.log('clicked Submit me')"
      />
    </div>
  </div>
</template>
