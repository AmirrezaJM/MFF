<script setup>
import { ref } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        // Expected format: [{ title: 'Title', content: 'Content' }]
    }
});

const activeIndex = ref(null);

const toggle = (index) => {
    activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<template>
    <div class="accordion">
        <div v-for="(item, index) in items" :key="index" class="accordion-item">
            <button class="accordion-header" @click="toggle(index)" :aria-expanded="activeIndex === index">
                <span class="title">{{ item.title }}</span>
                <span class="icon">{{ activeIndex === index ? '−' : '+' }}</span>
            </button>
            <div class="accordion-content" :class="{ 'is-open': activeIndex === index }"
                :style="{ maxHeight: activeIndex === index ? '200px' : '0' }">
                <div class="content-inner">
                    {{ item.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.accordion {
    border-radius: 12px;
    overflow: hidden;
    max-width: 600px;
    margin: 20px auto;
    border: 1px solid #e0e0e0;
}

.accordion-item {
    border-bottom: 1px solid #f0f0f0;
}

.accordion-item:last-child {
    border-bottom: none;
}

.accordion-header {
    width: 100%;
    background: #f9f9f9;
    color: #333;
    border: none;
    padding: 15px 20px;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s;
    font-size: 16px;
    font-weight: 500;
}

.accordion-header:hover {
    background: #f0f0f0;
}

.accordion-header .icon {
    font-weight: bold;
    font-size: 20px;
    margin-left: 10px;
    color: #666;
}

.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    background: white;
}

.accordion-content.is-open {
    border-top: 1px solid #f0f0f0;
}

.content-inner {
    padding: 15px 20px;
    line-height: 1.5;
    color: #444;
}
</style>
