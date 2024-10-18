import { Component } from 'vue';

export default interface Machine {
  id: number,
  data: string,
  link: string,
  name: string,
  cover: string,
  description: string,
  tags: string[],
  technologies: Component[],
}