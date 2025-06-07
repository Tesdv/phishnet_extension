async function ensureTagExists(tagId, tagName, tagColor) {
  const tags = await browser.messages.listTags();
  if (!tags.some(tag => tag.key === tagId)) {
    await createTag(tagId, tagName, tagColor);
  }
}

async function createTag(tagId, tagName, tagColor) {
  await browser.messages.createTag(tagId, tagName, tagColor);
  console.log(`Created custom tag: ${tagName}`);
}

async function removeTag(tagId, tagName, tagColor) {
  await browser.messages.removeTag(tagId, tagName, tagColor);
  console.log(`Removed custom tag: ${tagName}`);
}

async function isTagged(messageId, tagId) {
  const msg = await browser.messages.get(messageId);
  return msg.tags && msg.tags.includes(tagId);
}

async function tagMessage(messageId, tagId) {
  await browser.messages.update(messageId, { tags: [tagId] });
  console.log(`Applied custom tag ${tagId}`);
}