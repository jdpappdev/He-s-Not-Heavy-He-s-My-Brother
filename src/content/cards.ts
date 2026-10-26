/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CardContentItem {
  id: number;
  title: string;
  subtitle: string;
  variant: 'card-1' | 'card-2' | 'card-3' | 'card-4';
  bgClass: string;
  textClass: string;
  mutedTextClass: string;
  tagBgClass: string;
  paragraphs: {
    type: 'text' | 'pull' | 'ref' | 'final';
    text: string;
  }[];
}

export const CARDS_CONTENT: CardContentItem[] = [
  {
    id: 1,
    title: 'A little girl with a big heart',
    subtitle: 'Chapter I · Devotion',
    variant: 'card-1',
    bgClass: 'bg-[#C4C3B6]',
    textClass: 'text-[#000000]',
    mutedTextClass: 'text-[#595855]',
    tagBgClass: 'bg-black/10 text-black',
    paragraphs: [
      { type: 'text', text: 'Have you ever been so tired that even one more little request felt like too much?' },
      { type: 'text', text: 'We’ve all been there.' },
      { type: 'text', text: 'But sometimes, a simple story can remind us what really matters.' },
      { type: 'text', text: 'In Ghana, a young girl about ten years old walked for half an hour to attend a meeting at the Kingdom Hall.' },
      { type: 'text', text: 'It was hot. She was sweating. And she was carrying her baby brother on her back.' },
      { type: 'text', text: 'When she arrived, someone asked her: “Is he heavy?”' },
      { type: 'pull', text: '“He’s not heavy, he’s my brother.”' },
      { type: 'text', text: 'She didn’t say carrying him was easy.' },
      { type: 'text', text: 'She simply loved him enough to make the effort worthwhile.' },
      { type: 'text', text: 'And that little girl’s attitude teaches us something important.' },
    ],
  },
  {
    id: 2,
    title: 'See the person, not the burden',
    subtitle: 'Chapter II · Presence',
    variant: 'card-2',
    bgClass: 'bg-[#E7E5E4]',
    textClass: 'text-[#000000]',
    mutedTextClass: 'text-[#595855]',
    tagBgClass: 'bg-black/10 text-black',
    paragraphs: [
      { type: 'text', text: 'Sometimes our brothers and sisters need help. Maybe someone is struggling with an assignment. Maybe a friend is going through a difficult time. Or perhaps someone who usually helps everyone else is the one who needs encouragement.' },
      { type: 'text', text: 'It’s easy to think: “I’m already busy. Do I really have to do this too?”' },
      { type: 'text', text: 'But what if we looked at things differently?' },
      { type: 'text', text: 'Instead of seeing another responsibility, we saw an opportunity to show love.' },
      { type: 'pull', text: 'We’re more than people working together. We’re family.' },
      { type: 'text', text: '<strong>Listen.</strong> Sometimes being present is the help someone needs.' },
      { type: 'text', text: '<strong>Lend a hand.</strong> A small act can make a difficult day feel lighter.' },
      { type: 'text', text: '<strong>Accept support.</strong> You don’t have to carry everything alone.' },
    ],
  },
  {
    id: 3,
    title: 'Love makes the difference',
    subtitle: 'Chapter III · Loyalty',
    variant: 'card-3',
    bgClass: 'bg-[#595855]',
    textClass: 'text-[#E7E5E4]',
    mutedTextClass: 'text-[#E7E5E4]',
    tagBgClass: 'bg-white/20 text-[#E7E5E4]',
    paragraphs: [
      { type: 'text', text: '<strong>Jonathan and his armor-bearer.</strong> When Jonathan faced a difficult situation, his armor-bearer stood beside him with loyalty and willingness.' },
      { type: 'ref', text: '1 Samuel 14:7' },
      { type: 'text', text: '<strong>David and Abishai.</strong> When David became exhausted and needed protection, Abishai stepped in to help him.' },
      { type: 'ref', text: '2 Samuel 21:15-17' },
      { type: 'pull', text: 'Even strong people sometimes need someone beside them.' },
    ],
  },
  {
    id: 4,
    title: 'A family that carries one another',
    subtitle: 'Chapter IV · Reflection',
    variant: 'card-4',
    bgClass: 'bg-[#66654E]',
    textClass: 'text-[#E7E5E4]',
    mutedTextClass: 'text-[#E7E5E4]',
    tagBgClass: 'bg-white/20 text-[#E7E5E4]',
    paragraphs: [
      { type: 'text', text: 'The next time someone needs your help, pause for a moment.' },
      { type: 'text', text: 'Instead of asking, ‘How much more can I take?’' },
      { type: 'text', text: 'Ask, ‘How can I make this easier for my brother or sister?’' },
      { type: 'text', text: 'And when you’re the one feeling tired, don’t be afraid to accept help.' },
      { type: 'text', text: 'Because family isn’t about never getting tired. It’s about being there for one another when we do.' },
      { type: 'pull', text: 'We’re not carrying one another because it’s always easy.<br />We’re carrying one another because we love one another.' },
      { type: 'final', text: 'He’s not heavy. She’s not heavy. They’re our family.' },
    ],
  },
];
