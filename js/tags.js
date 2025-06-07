const msg = browser.messages;

async function ensureTagExists(tagId, tagName, tagColor) {
    const tags = await msg.listTags();
    if (!tags.some(tag => tag.key === tagId)) {
        await createTag(tagId, tagName, tagColor);
    }
}

async function createTag(tagId, tagName, tagColor) {
    await msg.createTag(tagId, tagName, tagColor);
    console.log(`Created custom tag: ${tagName}`);
}

async function removeTag(tagId, tagName, tagColor) {
    await msg.removeTag(tagId, tagName, tagColor);
    console.log(`Removed custom tag: ${tagName}`);
}

async function isTagged(messageId, tagId) {
    const message = await msg.get(messageId);
    return message.tags && message.tags.includes(tagId);
}

async function getMessageTags(messageId) {
    const message = await msg.get(messageId);
    return Array.isArray(message.tags) ? [...message.tags] : [];
}

async function tagMessage(messageId, tagId) {
    const tags = await getMessageTags(messageId);
     if (!tags.includes(tagId)) {
        tags.push(tagId);
        await msg.update(messageId, { tags });
        console.log(`Applied custom tag ${tagId}`);
    } else {
        console.log(`Message already tagged with ${tagId}`);
    }
}