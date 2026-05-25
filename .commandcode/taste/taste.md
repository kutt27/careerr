# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# ui
- Use single-column linear layout (flex flex-col) for task checklist items, not two-column grid. Confidence: 0.85
- When expanding/enriching roadmap content, keep it lean — enriched task strings only (1-2 sentences), avoid heavy breakdown objects (why/how/pitfall/outcome/keywords). Confidence: 0.85

# architecture
- Batch roadmap phases into 3 groups for parallel LLM calls to minimize API round-trips. Confidence: 0.80

# llm
- Use index-based fallback matching when correlating LLM expansion responses to original items, since LLMs don't reliably preserve exact ID fields across calls. Confidence: 0.70
