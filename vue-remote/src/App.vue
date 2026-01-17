<script setup>
import Accordion from './components/Accordion.vue'

const items = [
    { title: "Local Test 1", content: "Content for local test 1" },
    { title: "Local Test 2", content: "Content for local test 2" }
]
</script>

<template>
    <div style="padding: 20px; font-family: sans-serif;">
        <h1>Vue Remote Application</h1>
        <Accordion :items="items" />
    </div>
</template>
