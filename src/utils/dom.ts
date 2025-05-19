/**
 * Removes all selected div elements from the page
 * @returns {number} Number of elements removed
 */
export function removeSelectedDivs(): number {
  // 获取所有被选中的 div 元素
  const selectedDivs = Array.from(document.querySelectorAll('div'))
    .filter(div => {
      const selection = window.getSelection();
      return selection?.containsNode(div, true);
    });

  // 记录删除的元素数量
  const count = selectedDivs.length;

  // 安全地移除每个选中的元素
  selectedDivs.forEach(div => {
    // 在移除前检查元素是否仍在文档中
    if (div && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  });

  // 清除选区
  window.getSelection()?.removeAllRanges();

  return count;
}