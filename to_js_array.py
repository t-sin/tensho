from itertools import groupby

LOGO_PATH = 'tensho_logo.pgm'

if __name__ == '__main__':
    with open(LOGO_PATH) as f:
        f.readline()
        f.readline()
        w, h = [int(s) for s in f.readline().split(' ')]
        f.readline()
        vlis = list(map(lambda line: int(line), f.readlines()))

    image = []
    for i in range(int(len(vlis) / w)):
        start = i * w
        end = start + w
        image.append(vlis[start:end])

    values = sorted(dict(groupby(map(lambda x: x, vlis))).keys())
    new_value_dict = dict(zip(values, range(len(vlis))))

    indexed = []
    for row in image:
        new_row = []
        for val in row:
            new_row.append(new_value_dict[val])
        indexed.append(new_row)

    #print(indexed)

    print('export const data = [')
    for row in indexed:
        print('  [', end='')
        for v in row:
            print('{:>2,},'.format(v), end='')
        print('],')
    print('];')
