/**
 * Removes content from selected div elements while preserving the div structure
 * @returns {number} Number of elements cleared
 */
export function removeSelectedContent(): number {
  const selection = window.getSelection();
  if (!selection) return 0;

  // 获取所有被选中的 div 元素
  const selectedDivs = Array.from(document.querySelectorAll('div'))
    .filter(div => selection.containsNode(div, true));

  // 记录处理的元素数量  
  const count = selectedDivs.length;

  // 清空每个选中的div的内容
  selectedDivs.forEach(div => {
    if (div && div.parentNode) {
      div.textContent = '';
    }
  });

  // 清除选区
  selection.removeAllRanges();

  return count;
}

/**
 * Removes all selected div elements from the page
 * @returns {number} Number of elements removed
 */
export function removeSelectedDivs(): number {
  const selection = window.getSelection();
  if (!selection) return 0;

  // 获取所有被选中的 div 元素
  const selectedDivs = Array.from(document.querySelectorAll('div'))
    .filter(div => selection.containsNode(div, true));

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
  selection.removeAllRanges();

  return count;
}